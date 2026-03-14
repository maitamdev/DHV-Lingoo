import type { Metadata } from 'next';
import PlannerClient from './PlannerClient';

export const metadata: Metadata = {
  title: 'Ke hoach hoc tap | DHV-Lingoo',
  description: 'Lap ke hoach va theo doi tien trinh hoc hang ngay',
};

export default function PlannerPage() {
  return <PlannerClient />;
}