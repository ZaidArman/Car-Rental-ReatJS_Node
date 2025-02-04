import AuthProvider from './auth/auth.provider.jsx';
import LoadingProvider from './loading/loading.provider.jsx';

const RootProvider = ({ children }) => {
    return (
        <LoadingProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </LoadingProvider>
    );
};

export default RootProvider;
