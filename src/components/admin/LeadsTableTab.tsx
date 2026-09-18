import React, { useState } from 'react';
import { LeadData, LeadScore } from '../../types';
import { LeadService } from '../../services/leadService';
import { formatKcal } from '../../utils/calculator';
import {
  Download,
  Search,
  MessageCircle,
  Mail,
  Trash2,
  Sparkles,
  Award,
  Filter,
  CheckCircle,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface LeadsTableTabProps {
  leads: LeadData[];
  onRefresh: () => void;
}

export const LeadsTableTab: React.FC<LeadsTableTabProps> = ({ leads, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | LeadScore>('all');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesScore = scoreFilter === 'all' || lead.score === scoreFilter;

    return matchesSearch && matchesScore;
  });

  const handleExportCSV = () => {
    LeadService.exportToCSV(leads);
  };

  const handleSeedDemo = () => {
    LeadService.seedDemoLeads();
    onRefresh();
  };

  const handleClearDemo = () => {
    LeadService.clearDemoLeads();
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este lead?')) {
      LeadService.deleteLead(id);
      onRefresh();
    }
  };

  const getScoreBadge = (score: LeadScore) => {
    if (score === 'high') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          Alta Intenção
        </span>
      );
    }
    if (score === 'medium') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
          Média Intenção
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
        Explorador
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E8E6E1]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#8A928B] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, WhatsApp ou e-mail..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] placeholder:text-[#9EA59F] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/30"
            />
          </div>

          {/* Score filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#676F68]" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="px-2.5 py-2 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl text-xs font-semibold text-[#2D312E] focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/30"
            >
              <option value="all">Todas as Intenções</option>
              <option value="high">Alta Intenção</option>
              <option value="medium">Média Intenção</option>
              <option value="low">Explorador</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={leads.length === 0}
            className="px-3 py-2 rounded-xl bg-[#4A5D4E] hover:bg-[#3E4E42] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={handleSeedDemo}
            className="px-3 py-2 rounded-xl bg-[#EFF2EA] hover:bg-[#E2E7DB] text-[#4A5D4E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#4A5D4E]/20 transition-all cursor-pointer"
            title="Adicionar leads de demonstração"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Carregar Demo</span>
          </button>

          <button
            type="button"
            onClick={handleClearDemo}
            className="p-2 rounded-xl text-[#8A928B] hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-all cursor-pointer"
            title="Remover leads de demonstração"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-12 h-12 text-[#8A928B] mx-auto mb-3 opacity-40" />
            <h4 className="text-base font-serif font-bold text-[#2D312E]">
              Nenhum lead encontrado
            </h4>
            <p className="text-xs text-[#676F68] mt-1 max-w-sm mx-auto">
              Quando os visitantes realizarem o diagnóstico na página pública e liberarem o resultado completo, seus contatos e métricas aparecerão listados aqui.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleSeedDemo}
                className="px-4 py-2 rounded-xl bg-[#4A5D4E] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
              >
                Carregar Leads de Demonstração
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D312E]">
              <thead className="bg-[#FAF9F6] border-b border-[#E8E6E1] text-[10px] font-bold uppercase tracking-wider text-[#676F68]">
                <tr>
                  <th className="py-3.5 px-4">Data & Lead</th>
                  <th className="py-3.5 px-4">Contatos</th>
                  <th className="py-3.5 px-4">Objetivo & Acompanhamento</th>
                  <th className="py-3.5 px-4">Parâmetros (GET / Meta / IMC)</th>
                  <th className="py-3.5 px-4">Origem (UTM)</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {filteredLeads.map((lead) => {
                  const whatsappClean = lead.whatsapp.replace(/\D/g, '');
                  const formattedDate = new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={lead.id} className="hover:bg-[#FDFCFB] transition-colors">
                      {/* Data & Lead */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8A928B] mb-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                          {lead.isDemo && (
                            <span className="px-1 py-0.2 rounded text-[9px] bg-sky-100 text-sky-800 font-bold">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-sm text-[#2D312E]">{lead.name}</div>
                        <div className="mt-1">{getScoreBadge(lead.score)}</div>
                      </td>

                      {/* Contatos */}
                      <td className="py-3.5 px-4 space-y-1">
                        <a
                          href={`https://wa.me/55${whatsappClean}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{lead.whatsapp}</span>
                        </a>
                        {lead.email && (
                          <div className="flex items-center gap-1 text-[#676F68] text-[11px]">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Objetivo */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-[#2D312E] text-xs">
                          {lead.primaryGoal || 'Não informado'}
                        </div>
                        <div className="text-[11px] text-[#4A5D4E] font-semibold mt-0.5">
                          {lead.wantsFollowup === 'yes' && '✓ Quer consulta'}
                          {lead.wantsFollowup === 'maybe' && '~ Talvez futuramente'}
                          {lead.wantsFollowup === 'exploring' && '• Apenas conhecendo'}
                        </div>
                      </td>

                      {/* Métricas Calculadas */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-[#2D312E]">
                          GET: {formatKcal(lead.calculatorSnapshot.tdee)} kcal
                        </div>
                        <div className="text-[11px] text-[#4A5D4E]">
                          Meta: {formatKcal(lead.calculatorSnapshot.targetCalories)} kcal
                        </div>
                        <div className="text-[10px] text-[#676F68]">
                          IMC: {lead.calculatorSnapshot.imc} ({lead.calculatorSnapshot.imcCategory})
                        </div>
                      </td>

                      {/* UTMs */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#F5F3EF] border border-[#E8E6E1] text-[10px] font-semibold text-[#555C56]">
                          {lead.utm.utm_source || 'direto'}
                        </span>
                        {lead.utm.utm_medium && (
                          <div className="text-[10px] text-[#8A928B] mt-0.5">
                            {lead.utm.utm_medium}
                            {lead.utm.utm_campaign ? ` / ${lead.utm.utm_campaign}` : ''}
                          </div>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 rounded-lg text-[#8A928B] hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Excluir este lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
