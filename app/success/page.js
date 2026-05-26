import Link from "next/link";

export default function SuccessPage() {
    return (        
        <div className="page-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h1 className="text-large" style={{ fontSize: '32px', marginBottom: '10px' }}>Success!!!</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Thank you for your purchase! Your transaction was successful. We appreciate your support and hope you enjoy your new items. If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <div className="error-actions">
                <Link href="/" className="button-card" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Back to Store
                </Link>                 
            </div>
        </div>
    );
}
