"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { MenuLateral } from "@/components/widgets-configuracoes/menu-lateral";
import { SecaoPerfil } from "@/components/widgets-configuracoes/secao-perfil";
import { SecaoNotificacoes } from "@/components/widgets-configuracoes/secao-notificacoes";
import { SecaoSeguranca } from "@/components/widgets-configuracoes/secao-seguranca";
import { UsuarioConfig } from "@/types/configuracoes";


const CONFIG_INICIAL: UsuarioConfig = {
  nome: "Marcos Silva",
  email: "marcos.estudante@conectaedu.com",
  cargo: "Estudante",
  bio: "Focado em aprender programação Fullstack e passar no vestibular.",
  notificacoes: {
    emailAulas: true,
    emailMarketing: false,
    pushLembretes: true,
    pushMentoria: true
  }
};

type AbaSettings = "perfil" | "notificacoes" | "seguranca" | "aparencia";

export default function PageConfiguracoes() {
  const [activeTab, setActiveTab] = useState<AbaSettings>("perfil");
  const [config, setConfig] = useState<UsuarioConfig>(CONFIG_INICIAL);
  const [isLoaded, setIsLoaded] = useState(false);

  // carrega o localstorage
  useEffect(() => {
    const saved = localStorage.getItem("conectaedu-config");
    if (saved) {
      setConfig(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // salva localstorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("conectaedu-config", JSON.stringify(config));
    }
  }, [config, isLoaded]);

  const handleUpdateConfig = (newConfig: Partial<UsuarioConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    toast.success("Alterações salvas com sucesso!");
  };

  const handleUpdateNotif = (newNotif: Partial<UsuarioConfig['notificacoes']>) => {
    setConfig(prev => ({
      ...prev,
      notificacoes: { ...prev.notificacoes, ...newNotif }
    }));

  };

  if (!isLoaded) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen w-full bg-white p-6 md:p-10 animate-in fade-in duration-700">
      <Toaster position="bottom-right" richColors />

      {/* Header */}
      <header className="mb-10 border-b border-slate-100 pb-6">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Configurações
        </h1>
        <h2 className="text-xl text-slate-500 mt-2 font-medium">
          Gerencie sua conta e preferências.
        </h2>
      </header>

      {/* menu lateral  e conteúdo */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* menu lateral fixo*/}
        <aside className="shrink-0">
          <MenuLateral abaAtiva={activeTab} aoMudarAba={setActiveTab} />
        </aside>

        {/* area de conteúdo */}
        <main className="flex-1 min-w-0">
          {activeTab === "perfil" && (
            <SecaoPerfil dados={config} aoSalvar={handleUpdateConfig} />
          )}
          
          {activeTab === "notificacoes" && (
            <SecaoNotificacoes dados={config} aoSalvar={handleUpdateNotif} />
          )}

          {activeTab === "seguranca" && (
            <SecaoSeguranca />
          )}

          {activeTab === "aparencia" && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Aparência</h2>
              <p className="text-sm text-slate-500">
                O tema <strong>Claro</strong> está definido como padrão pela instituição. 
                <br />O modo escuro estará disponível em breve.
              </p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}