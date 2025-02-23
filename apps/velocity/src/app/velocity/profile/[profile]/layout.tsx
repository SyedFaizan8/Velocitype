import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getProfileMetadata } from '@/utils/metadataHelpers';

export async function generateMetadata(
    { params }: { params: Promise<{ profile: string }> },
): Promise<Metadata> {
    const { profile } = await params;
    return await getProfileMetadata(profile);
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return <div className="profile-layout">{children}</div>;
}
