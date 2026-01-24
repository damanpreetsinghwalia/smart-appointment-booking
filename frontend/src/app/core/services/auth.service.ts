import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('AuthService - Login response:', response);
          
          // Save token separately
          localStorage.setItem('token', response.token);

          // Create user object with ALL fields from response
          const user: User = {
            id: response.userId || '',
            userId: response.userId || '',
            email: response.email,
            firstName: response.firstName || '',
            lastName: response.lastName || '',
            fullName: response.fullName || `${response.firstName || ''} ${response.lastName || ''}`.trim(),
            phoneNumber: response.phoneNumber || '',
            role: response.role || '',
            roles: response.roles || (response.role ? [response.role] : []),
            token: response.token
          };
          
          // Save complete user object to localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          console.log('AuthService - User saved to localStorage:', user);
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/register`, data)
      .pipe(
        tap(response => {
          console.log('AuthService - Register response:', response);
          
          // If registration returns a token, save user data
          if (response.token) {
            localStorage.setItem('token', response.token);
            
            const user: User = {
              id: response.userId || '',
              userId: response.userId || '',
              email: response.email,
              firstName: response.firstName || data.firstName,
              lastName: response.lastName || data.lastName,
              fullName: response.fullName || `${data.firstName} ${data.lastName}`.trim(),
              phoneNumber: response.phoneNumber || data.phoneNumber || '',
              role: response.role || data.role,
              roles: response.roles || (response.role ? [response.role] : [data.role]),
              token: response.token
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            
            console.log('AuthService - User registered and saved:', user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.token;
    console.log('AuthService - isAuthenticated:', hasToken);
    return hasToken;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes(role) || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    if (!user || !user.token) {
      return null;
    }
    return user.token;
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    
    // First try the single 'role' field
    if (user?.role) {
      return user.role;
    }
    
    // Then try the 'roles' array
    if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles[0];
    }
    
    return null;
  }
}