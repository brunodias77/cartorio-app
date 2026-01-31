import React from 'react';
import { FileDigit, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from './card';

export interface Stats {
    total: number;
    pendingSent?: number;
    completed?: number;
}

interface ProtocolStatsProps {
    stats: Stats;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    borderColor: string;
    bgColor: string;
    iconColor: string;
}

const StatCard = ({ title, value, icon, borderColor, bgColor, iconColor }: StatCardProps) => (
    <Card className={`p-6 flex items-center justify-between border-l-4 ${borderColor}`}>
        <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                {title}
            </p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 ${bgColor} rounded-full ${iconColor}`}>
            {icon}
        </div>
    </Card>
);

export const ProtocolStats = ({ stats }: ProtocolStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                title="Total de Protocolos"
                value={stats.total}
                icon={<FileDigit size={24} />}
                borderColor="border-l-blue-500"
                bgColor="bg-blue-50"
                iconColor="text-blue-600"
            />

            <StatCard
                title="Envios Pendentes"
                value={stats.pendingSent || 0}
                icon={<Clock size={24} />}
                borderColor="border-l-amber-500"
                bgColor="bg-amber-50"
                iconColor="text-amber-600"
            />

            <StatCard
                title="Concluídos"
                value={stats.completed || 0}
                icon={<CheckCircle2 size={24} />}
                borderColor="border-l-emerald-500"
                bgColor="bg-emerald-50"
                iconColor="text-emerald-600"
            />
        </div>
    );
}