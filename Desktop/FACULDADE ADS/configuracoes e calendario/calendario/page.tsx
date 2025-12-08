"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from "lucide-react";
import { Toaster, toast } from "sonner"; 

import { GridCalendario } from "@/components/widgets-calendario/grid-calendario";
import { ModalEvento } from "@/components/widgets-calendario/modal-evento";
import { CalendarioEvento } from "@/types/calendario";

export default function PageCalendario() {
  const [eventos, setEventos] = useState<CalendarioEvento[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataBase, setDataBase] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<CalendarioEvento | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");

  useEffect(() => {
    const dados = localStorage.getItem("conectaedu-calendario");
    if (dados) {
      setEventos(JSON.parse(dados));
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setEventos([
        { id: "1", titulo: "Prova de Inglês", tipo: "prova", data: hoje, horaInicio: "08:00", horaFim: "10:00", descricao: "Verbos irregulares." },
        { id: "2", titulo: "Entrega Projeto", tipo: "entrega", data: hoje, horaInicio: "23:59", horaFim: "23:59", descricao: "Módulo React." }
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("conectaedu-calendario", JSON.stringify(eventos));
    }
  }, [eventos, isLoaded]);

  const handlePrevMonth = () => setDataBase(new Date(dataBase.getFullYear(), dataBase.getMonth() - 1, 1));
  const handleNextMonth = () => setDataBase(new Date(dataBase.getFullYear(), dataBase.getMonth() + 1, 1));
  const handleToday = () => setDataBase(new Date());

  const handleCellClick = (dataIso: string) => {
    setEventoSelecionado(null);
    setDataSelecionada(dataIso);
    setIsModalOpen(true);
  };

  const handleEventClick = (evento: CalendarioEvento) => {
    setEventoSelecionado(evento);
    setIsModalOpen(true);
  };

  const handleSave = (dados: Omit<CalendarioEvento, "id">) => {
    if (eventoSelecionado) {
      setEventos(prev => prev.map(e => e.id === eventoSelecionado.id ? { ...dados, id: e.id } : e));
      toast.success("Evento atualizado!");
    } else {
      setEventos(prev => [...prev, { ...dados, id: crypto.randomUUID() }]);
      toast.success("Evento criado com sucesso!");
    }
  };

  const handleDelete = (id: string) => {
    const backup = [...eventos];
    setEventos(prev => prev.filter(e => e.id !== id));
    setIsModalOpen(false);
    toast.success("Evento removido", {
        action: {
            label: "Desfazer",
            onClick: () => setEventos(backup),
        }
    });
  };

  if (!isLoaded) return <div className="h-screen w-full bg-white animate-pulse" />;

  const tituloMes = dataBase.toLocaleDateString("pt-BR", { month: "long" });
  const tituloMesFormatado = tituloMes.charAt(0).toUpperCase() + tituloMes.slice(1);
  const ano = dataBase.getFullYear();

  return (
    <div className="h-screen w-full bg-white flex flex-col px-8 py-6 overflow-hidden">
      
      <Toaster position="bottom-right" richColors theme="light" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {tituloMesFormatado} <span className="text-slate-400 font-normal">{ano}</span>
          </h1>
          
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 ml-4">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleToday} className="px-3 text-xs font-bold text-slate-600 hover:text-[#0A2A6B] transition-colors">
              Hoje
            </button>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <button 
          onClick={() => { setEventoSelecionado(null); setDataSelecionada(""); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#0A2A6B] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-[#061A3F] transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} /> Novo Evento
        </button>
      </div>

      {/* 2. Grid (Expandido) */}
      <div className="flex-1 min-h-0">
        <GridCalendario 
          dataBase={dataBase} 
          eventos={eventos} 
          onDataClick={handleCellClick}
          onEventoClick={handleEventClick}
        />
      </div>

      <ModalEvento 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        eventoInicial={eventoSelecionado}
        dataPreSelecionada={dataSelecionada}
      />

    </div>
  );
}