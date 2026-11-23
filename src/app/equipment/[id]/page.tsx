
import { Suspense } from "react";
import EquipmentDetailsClient from "./EquipmentDetailsClient";

export const instant = false;

interface PageProps {
    params: Promise<{ id: string }>;
}

function HeaderSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading equipment details">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>
    );
}


export default async function EquipmentDetailsPage({
    params,
}: PageProps) {
    
    const { id } = await params;

    return (
    
    <Suspense fallback={<HeaderSkeleton />}>
    
    <EquipmentDetailsClient id={id} />
</Suspense>

)}



// import { Suspense } from 'react'
// import { UserHeader } from './user-header'
// import { HeaderSkeleton } from './header-skeleton'
 
// export default function Page() {
//   return (
//     <DashboardShell>
//       <Suspense fallback={<HeaderSkeleton />}>
//         <UserHeader />
//       </Suspense>
//       <CachedStats />
//     </DashboardShell>
//   )
// }