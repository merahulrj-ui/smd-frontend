"use client";

import dynamic from 'next/dynamic';

const MobileDrawer = dynamic(() => import('@/components/MobileDrawer'), { ssr: false });
const GlobalModals = dynamic(() => import('@/components/GlobalModals'), { ssr: false });

export default function LazyComponents() {
  return (
    <>
      <MobileDrawer />
      <GlobalModals />
    </>
  );
}
