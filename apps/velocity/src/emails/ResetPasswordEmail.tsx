import React from 'react';
import { Container, Section, Text, Button } from '@react-email/components';

interface ResetPasswordEmailProps {
    resetUrl: string;
    name: string;
}

const ResetPasswordEmail = ({ resetUrl, name }: ResetPasswordEmailProps): React.ReactNode => {
    return (
        <Container style={containerStyle}>
            <Section style={sectionStyle}>
                <Text style={{ ...headingStyle, fontFamily: 'monospace', color: '#0070f3' }}>VelociType</Text>
                <Text style={headingStyle}>Password Reset Request</Text>
                <Text style={textStyle}>Hi {name},</Text>
                <Text style={textStyle}>
                    You recently requested to reset your password. Click the button below to proceed.
                    If you did not request this, please ignore this email.
                </Text>
                <Button style={{ ...buttonStyle, backgroundColor: '#28a745' }} href={resetUrl}>
                    Reset Password
                </Button>
                <Text style={footerTextStyle}>
                    This link will expire in 1 hour.
                </Text>
            </Section>
        </Container>
    );
};

const containerStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
};

const sectionStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
};

const headingStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px',
};

const textStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#555555',
    marginBottom: '16px',
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#0070f3',
    color: '#ffffff',
    padding: '12px 24px',
    textDecoration: 'none',
    borderRadius: '4px',
    display: 'inline-block',
    fontWeight: 'bold',
    marginTop: '20px',
};

const footerTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#888888',
    marginTop: '30px',
};

export default ResetPasswordEmail;
