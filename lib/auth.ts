export interface User {
	email: string;
	password: string;
	fullName: string;
}

export const authService = {
	// Store user registration in localStorage
	register: (fullName: string, email: string, password: string): boolean => {
		if (typeof window === 'undefined') return false;

		// Check if user already exists
		const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
		if (existingUsers.some((u) => u.email === email)) {
			return false; // User already registered
		}

		// Add new user
		const newUser: User = { fullName, email, password };
		existingUsers.push(newUser);
		localStorage.setItem('users', JSON.stringify(existingUsers));

		return true;
	},

	// Validate login credentials
	login: (email: string, password: string): User | null => {
		if (typeof window === 'undefined') return null;

		const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
		const user = users.find((u) => u.email === email && u.password === password);

		if (user) {
			// Store current logged-in user
			localStorage.setItem('currentUser', JSON.stringify(user));
			localStorage.setItem('isLoggedIn', 'true');
			// Dispatch custom event to notify all listeners
			window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: true, user } }));
			return user;
		}

		return null;
	},

	// Get current logged-in user
	getCurrentUser: (): User | null => {
		if (typeof window === 'undefined') return null;

		const currentUser = localStorage.getItem('currentUser');
		return currentUser ? JSON.parse(currentUser) : null;
	},

	// Check if user is logged in
	isLoggedIn: (): boolean => {
		if (typeof window === 'undefined') return false;

		return localStorage.getItem('isLoggedIn') === 'true';
	},

	// Logout
	logout: (): void => {
		if (typeof window === 'undefined') return;

		localStorage.removeItem('currentUser');
		localStorage.removeItem('isLoggedIn');
		// Dispatch custom event to notify all listeners
		window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: false, user: null } }));
	},
};
