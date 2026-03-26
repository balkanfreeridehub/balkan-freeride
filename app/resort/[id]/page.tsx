"use client"
import { useParams } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';

export default function ResortPage() {
  const params = useParams();
  
  // Ovo pokriva: "154967", "id:154967" i URL-encoded varijante
  const rawId = params.id ? decodeURIComponent(params.id.toString()) : "";
  const cleanId = rawId.replace(/\D/g, ""); // Čisti sve što nije broj
  
  const resort = balkanResorts.find(r => r.id.toString() === cleanId);

  // ... ostatak komponente
}