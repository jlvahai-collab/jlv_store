import Link from "next/link";

export default function NotFound() {
    return (        
        <div className="page-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h1 className="error-title" style={{ fontSize: '32px', marginBottom: '10px' }}>404 - Page Not Found</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                The page you are looking for doesn't exist or has been moved.
            </p>
            
            <div className="error-actions">
                <Link href="/" className="button-card" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Back to Store
                </Link>                 
            </div>
        </div>
    );
}
