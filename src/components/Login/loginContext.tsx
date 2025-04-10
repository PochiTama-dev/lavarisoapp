import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, cuil: string) => Promise<void>;
  logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;  
  }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('empleadoId')  
  );

  const login = async (email: string, cuil: string) => {
    try {
      const response = await fetch('https://lv-back.online/empleados');
      const empleados = await response.json();
      const empleado = empleados.find((empleado: any) => empleado.email === email && empleado.cuil === cuil);

      if (empleado) {
        if (empleado.id_rol === 5 || empleado.id_rol === 4) {
          localStorage.setItem('empleadoEmail', email);
          localStorage.setItem('empleadoNombre', empleado.nombre);
          localStorage.setItem('empleadoId', empleado.id);
          localStorage.setItem('empleadoLegajo', empleado.legajo);
          setIsAuthenticated(true);
        } else {
          throw new Error('Acceso denegado. Solo los técnicos pueden acceder a esta pantalla.');
        }
      } else {
        throw new Error('El correo electrónico o el cuil no coinciden en la base de datos.');
      }
    } catch (error) {
        //@ts-ignore
      throw new Error(error.message || 'Ocurrió un error al verificar el correo electrónico.');
    }
  };

  const logout = () => {
    localStorage.removeItem('empleadoEmail');
    localStorage.removeItem('empleadoNombre');
    localStorage.removeItem('empleadoId');
    localStorage.removeItem('empleadoLegajo');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
