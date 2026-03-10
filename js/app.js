
// --- MODAL DE IMPORTAÇÃO (TOPO) ---
const ImportModal = ({ isOpen, onClose, onSelect }) => {
    const [clients, setClients] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState("");
    const [assessments, setAssessments] = React.useState([]);

    React.useEffect(() => {
        if (isOpen) {
            db.collection("radar_v3_clientes").get().then(s => setClients(s.docs.map(d => d.id)));
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (selectedClient) {
            db.collection("radar_v3_respostas").get().then(s => {
                const filtered = s.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(a => a.clientName === selectedClient);
                setAssessments(filtered);
            });
        }
    }, [selectedClient]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-10 bg-black/70 animate-down">
            <div className="glass-modal w-full max-w-lg rounded-xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-cinzel text-blue-100">Importar Avaliação</h2>
                    <button onClick={onClose} className="text-blue-500 hover:text-white"><i className="fas fa-times"></i></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[8px] font-bold text-blue-500 uppercase mb-1 block">Selecione o Cliente</label>
                        <select
                            className="w-full bg-slate-900 border border-blue-800 text-white p-2 rounded text-[10px]"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                        >
                            <option value="">Escolha um cliente...</option>
                            {clients.map(c => <option key={`cli-${c}`} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scroll space-y-1">
                        {assessments.length > 0 ? assessments.map(a => (
                            <button key={`ass-${a.id}`} onClick={() => onSelect(a)} className="w-full text-left bg-blue-900/20 p-2 rounded border border-blue-800 hover:border-blue-500 text-[10px]">
                                <div className="font-bold text-white">{a.assessmentName}</div>
                                <div className="text-[8px] opacity-50">{a.dataAvaliacao ? new Date(a.dataAvaliacao.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
                            </button>
                        )) : <div className="text-center p-4 opacity-30 italic">Nenhuma avaliação encontrada</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MODAL DE AJUDA (TUTORIAL CONTEXTUAL) ---
const HelpModal = ({ isOpen, onClose, currentTab }) => {
    if (!isOpen) return null;

    // Dicionário para títulos dinâmicos
    const tabNames = {
        'questionario': '1. Estrutura & Questionário',
        'radar': '2. Resultados & Métricas',
        'plano_acao': '3. Planos de Ação & IA'
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-10 bg-black/90 backdrop-blur-sm animate-fade">
            <div className="bg-slate-900 w-full max-w-3xl rounded-xl border border-blue-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header do Modal */}
                <div className="bg-slate-800 p-4 border-b border-blue-700 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-lg font-cinzel text-white flex items-center gap-2">
                            <i className="fas fa-book-open text-blue-400"></i> Manual do Facilitador
                        </h2>
                        <div className="text-[10px] text-blue-300 mt-1 uppercase tracking-widest font-bold">
                            Lendo documentação da aba: <span className="text-amber-400">{tabNames[currentTab]}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors h-full px-2">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Conteúdo Dinâmico por Aba */}
                <div className="p-6 overflow-y-auto custom-scroll space-y-6 text-blue-100/90 text-[11px] leading-relaxed">

                    {/* CONTEÚDO DA ABA 1: QUESTIONÁRIO */}
                    {currentTab === 'questionario' && (
                        <div className="space-y-6 animate-fade">
                            <section>
                                <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-3 border-b border-blue-800 pb-1">
                                    <i className="fas fa-list-check mr-2"></i>Guia Prático
                                </h3>
                                <ul className="list-disc pl-5 space-y-2 text-blue-200/80">
                                    <li><strong>Edição e Ordem:</strong> Clique em <span className="bg-amber-600 text-white px-1 rounded text-[9px]">EDITAR ESTRUTURA</span>. Use as setas para reordenar.</li>
                                    <li><strong>Olho de Visibilidade:</strong> Oculta um eixo ou pergunta sem apagá-lo do banco de dados, preservando o histórico de clientes antigos.</li>
                                    <li><strong>Histórico e Reedição:</strong> Use o botão "Importar" no topo para carregar avaliações anteriores e continuar de onde parou.</li>
                                </ul>
                            </section>

                            <section className="bg-slate-800/50 p-4 rounded-xl border border-blue-900/50">
                                <h3 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fas fa-cogs"></i> Funcionamento Técnico (Under the Hood)
                                </h3>
                                <div className="space-y-3 text-[10px]">
                                    <p><strong>Motor de Respostas:</strong> A escala avaliativa mapeia chaves inteiras (1 a 5) em labels de maturidade ("Não", "Raro", "Cult", etc). O valor 0 (Zero) é lido tecnicamente como N/A e é <strong>ignorado no cálculo das médias</strong>.</p>
                                    <p><strong>Vinculação de Papéis:</strong> No modo de edição, o select ao lado de cada pergunta amarra aquele quesito a um "Papel" específico. É este vínculo que permite ao gráfico "Comparativo de Papéis" desenhar as linhas separadas mais tarde.</p>
                                    <p><strong>Geração de IDs Dinâmicos:</strong> Cada eixo, subgrupo, pergunta e papel gerado via interface cria um ID hash alfanumérico único. Isso garante que, se você mudar o "Nome" de uma pergunta, os dados antigos não quebram.</p>
                                    <p><strong>Fluxo de Salvamento:</strong> Ao clicar no botão azul de Salvar, o sistema guarda todo o objeto JSON global (Eixos, Subgrupos, Papéis) dentro do documento <code>config/global</code> no Firestore. As notas dadas ao cliente são salvas em uma coleção separada <code>radar_v3_respostas</code> vinculada ao nome dele.</p>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* CONTEÚDO DA ABA 2: RESULTADOS (RADAR) */}
                    {currentTab === 'radar' && (
                        <div className="space-y-6 animate-fade">
                            <section>
                                <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-3 border-b border-blue-800 pb-1">
                                    <i className="fas fa-chart-pie mr-2"></i>Guia Prático
                                </h3>
                                <ul className="list-disc pl-5 space-y-2 text-blue-200/80">
                                    <li><strong>Filtro por Eixo:</strong> Ao clicar em um gráfico de Eixo (topo), o sistema foca o <em>Comparador</em> apenas naquele tema.</li>
                                    <li><strong>Filtro por Papel:</strong> Ao selecionar um papel na lateral direita, o Gráfico 2 limpa os outros papéis e foca apenas no selecionado.</li>
                                    <li><strong>Comparador Histórico:</strong> Os 3 slots inferiores permitem comparar. O primeiro slot (Atual) já vem preenchido. Clique nos slots vazios (+) para puxar avaliações passadas do mesmo cliente.</li>
                                </ul>
                            </section>

                            <section className="bg-slate-800/50 p-4 rounded-xl border border-blue-900/50">
                                <h3 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fas fa-cogs"></i> Funcionamento Técnico (Under the Hood)
                                </h3>
                                <div className="space-y-3 text-[10px]">
                                    <p><strong>Cálculo de Médias (calcScore):</strong> A função matemática por trás dos gráficos soma todas as notas maiores que zero e divide apenas pela quantidade de itens respondidos. Se um eixo tem 10 perguntas e apenas 5 foram respondidas, o divisor será 5. Isso evita penalizar a média com itens "N/A".</p>
                                    <p><strong>Isolamento de Filtros (UX):</strong> Existe uma regra de independência. Se o filtro global for do tipo "Eixo", o gráfico "Comparativo de Papéis" ignora esse filtro e desenha o panorama completo. Se o usuário clica em um botão de "Papel", o filtro age exclusivamente neste gráfico, mantendo a estabilidade visual.</p>
                                    <p><strong>Explorador de Respostas:</strong> O controle deslizante (Slider) não altera o banco de dados. Ele realiza uma varredura real-time no array flat do modelo ativo e exibe exatamente quais perguntas receberam a pontuação do slider (Ex: Mostra exatamente o que tirou 3).</p>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* CONTEÚDO DA ABA 3: PLANOS DE AÇÃO */}
                    {currentTab === 'plano_acao' && (
                        <div className="space-y-6 animate-fade">
                            <section>
                                <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-3 border-b border-blue-800 pb-1">
                                    <i className="fas fa-clipboard-list mr-2"></i>Guia Prático
                                </h3>
                                <ul className="list-disc pl-5 space-y-2 text-blue-200/80">
                                    <li><strong>Contexto do Líder:</strong> Use este campo para escrever percepções humanas que os gráficos não mostram (comportamentos, medos, cultura).</li>
                                    <li><strong>Aprofundamento de Regras:</strong> Se alguma regra técnica foi violada (aparece na lista), selecione ela e adicione seu comentário de especialista.</li>
                                    <li><strong>Criar Regras:</strong> No painel direito, cadastre alertas como: "Se o quesito DevOps for &lt; 2, emitir alerta X". O sistema avaliará isso em todos os clientes automaticamente a partir de agora.</li>
                                    <li><strong>Gerar Prompt (Botão Roxo):</strong> Clica aqui, vai no ChatGPT/Gemini e cola. Ele fará uma análise sênior baseada no seu contexto.</li>
                                </ul>
                            </section>

                            <section className="bg-slate-800/50 p-4 rounded-xl border border-blue-900/50">
                                <h3 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fas fa-cogs"></i> Funcionamento Técnico (Under the Hood)
                                </h3>
                                <div className="space-y-3 text-[10px]">
                                    <p><strong>Trigger Automático de Regras:</strong> A constante <code>triggeredRules</code> itera sobre todas as regras cadastradas (que são salvas na config global do Firestore). Se a regra aponta para "MÉDIA GERAL", ele cruza o operador (&lt;, &gt;, ==, etc) contra o cálculo de média de todo o radar. Se aponta para uma pergunta, avalia pontualmente. Apenas regras que retornam <em>TRUE</em> aparecem no dropdown de contexto.</p>
                                    <p><strong>Cálculo Rápido de Oportunidades (Listas Expansíveis):</strong> O sistema classifica perguntas em duas matrizes dinâmicas. Tudo que pontuou maior que 3 (4 e 5) cai em "Pontos Fortes". Tudo que pontuou menor ou igual a 3 (mas maior que 0) cai como "Oportunidades".</p>
                                    <p><strong>Montagem do Prompt da IA:</strong> O botão roxo concatena variáveis dinamicamente. Ele injeta o texto livre do líder, o Array mapeado das regras engatilhadas + os comentários salvos sobre elas, e os top 15 itens mais fracos ou fortes para formar um bloco de contexto perfeito para LLMs.</p>
                                </div>
                            </section>
                        </div>
                    )}

                    <div className="bg-blue-900/40 p-3 rounded border border-blue-800 text-center italic text-blue-400 mt-4">
                        "O objetivo não é apenas medir, mas gerar conversas de valor e planos acionáveis."
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE DE GRÁFICO (Wrapper para Chart.js) ---
const ChartComponent = ({ type, data, options, onClick }) => {
    const chartRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(ctx, {
            type: type,
            data: data,
            options: {
                ...options,
                responsive: true,
                maintainAspectRatio: false,
                onClick: (evt, elements) => {
                    if (onClick) onClick();
                }
            }
        });

        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [data, options]);

    return <div className="relative w-full h-full"><canvas ref={canvasRef}></canvas></div>;
};

// --- MODAL DE SELEÇÃO PARA COMPARAÇÃO ---
const ComparisonModal = ({ isOpen, onClose, onSelect }) => {
    const [clients, setClients] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState("");
    const [assessments, setAssessments] = React.useState([]);

    React.useEffect(() => {
        if (isOpen) {
            db.collection("radar_v3_clientes").get().then(s => setClients(s.docs.map(d => d.id)));
            setSelectedClient("");
            setAssessments([]);
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (selectedClient) {
            db.collection("radar_v3_respostas").where("clientName", "==", selectedClient).orderBy("dataAvaliacao", "desc").limit(10).get()
                .then(s => setAssessments(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        }
    }, [selectedClient]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade">
            <div className="bg-slate-800 w-full max-w-sm rounded-xl p-4 border border-blue-500 shadow-2xl">
                <div className="flex justify-between items-center mb-4 border-b border-blue-800 pb-2">
                    <h3 className="text-sm font-cinzel text-white">Selecionar para Comparar</h3>
                    <button onClick={onClose} className="text-blue-400 hover:text-white"><i className="fas fa-times"></i></button>
                </div>
                <div className="space-y-3">
                    <select className="w-full bg-slate-900 border border-blue-700 text-white text-[10px] p-2 rounded outline-none focus:border-blue-400"
                        value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                        <option value="">Selecione o Cliente...</option>
                        {clients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <div className="max-h-60 overflow-y-auto custom-scroll space-y-1">
                        {assessments.map(a => (
                            <button key={a.id} onClick={() => onSelect(a)}
                                className="w-full text-left p-2 rounded bg-blue-900/40 hover:bg-blue-600 border border-blue-800/50 hover:border-blue-300 transition-all group">
                                <div className="text-[10px] font-bold text-white group-hover:text-white">{a.assessmentName}</div>
                                <div className="text-[8px] text-blue-400 group-hover:text-blue-200">
                                    {a.dataAvaliacao ? new Date(a.dataAvaliacao.seconds * 1000).toLocaleDateString() : '-'}
                                </div>
                            </button>
                        ))}
                        {selectedClient && assessments.length === 0 && <div className="text-center text-[9px] text-blue-500 italic">Sem avaliações.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ABA RADAR (MÉTRICAS & COMPARADOR) ---
const RadarTab = ({ model, roles, respostas, activeInfo }) => {
    const [filter, setFilter] = React.useState({ type: 'geral', id: null, label: 'Visão Geral' });
    const [slots, setSlots] = React.useState([null, null, null]);
    const [targetSlot, setTargetSlot] = React.useState(null);
    const [scoreFilter, setScoreFilter] = React.useState(3);

    React.useEffect(() => {
        setSlots(prev => {
            const newSlots = [...prev];
            if (!newSlots[0] || newSlots[0].isCurrent) {
                newSlots[0] = { ...activeInfo, respostas, assessmentName: "ATUAL (Editando)", isCurrent: true };
            }
            return newSlots;
        });
    }, [respostas, activeInfo]);

    const calcScore = (answers, questionList) => {
        let sum = 0, count = 0;
        questionList.forEach(q => {
            if (answers[q.id]) { sum += answers[q.id]; count++; }
        });
        return count > 0 ? (sum / count) : 0;
    };

    const commonOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: { color: '#f8fafc', font: { size: 9 } },
                ticks: { display: false, min: 0, max: 5, stepSize: 1 }
            }
        },
        plugins: { legend: { display: false } }
    };

    const axesCharts = model.filter(e => !e.hidden).map(axis => {
        const labels = axis.subgrupos.filter(s => !s.hidden).map(s => s.nome);
        const dataPoints = axis.subgrupos.filter(s => !s.hidden).map(sub => {
            const qs = sub.perguntas.filter(p => !p.hidden);
            return calcScore(respostas, qs);
        });
        return {
            id: axis.id, title: axis.nome,
            chartData: {
                labels: labels,
                datasets: [{ label: 'Atual', data: dataPoints, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3b82f6', borderWidth: 2, pointBackgroundColor: '#fff' }]
            }
        };
    });

    const activeRoles = roles.filter(r => !r.hidden);

    // 1. Verifica o que o usuário clicou
    const rolesToShow = filter.type === 'role'
        ? activeRoles.filter(r => r.nome === filter.id)
        : activeRoles;

    const roleChartData = {
        labels: model.filter(e => !e.hidden).map(e => e.nome),

        // 2. Usamos o rolesToShow em vez de activeRoles
        datasets: rolesToShow.map((role) => {

            // 3. UX: Manter a cor exata do botão no gráfico!
            // Para isso, buscamos a posição original do papel na lista completa
            const originalIdx = activeRoles.findIndex(r => r.id === role.id);
            const idxToUse = originalIdx > -1 ? originalIdx : 0;

            const color = `hsla(${210 + (idxToUse * 30)}, 70%, 50%, 0.4)`;
            const border = `hsla(${210 + (idxToUse * 30)}, 70%, 50%, 1)`;

            return {
                label: role.nome,
                backgroundColor: color,
                borderColor: border,
                borderWidth: 1,
                data: model.filter(e => !e.hidden).map(axis => {
                    const roleQs = [];
                    axis.subgrupos.forEach(s => s.perguntas.forEach(p => {
                        if (!p.hidden && p.papel === role.nome) roleQs.push(p);
                    }));
                    return calcScore(respostas, roleQs);
                })
            };
        })
    };

    const getSlotData = (slotData) => {
        if (!slotData) return null;
        const slotRespostas = slotData.respostas || {};
        const color = slotData.isCurrent ? '#3b82f6' : '#fbbf24';
        const bg = slotData.isCurrent ? 'rgba(59, 130, 246, 0.2)' : 'rgba(251, 191, 36, 0.2)';

        let labels = [], data = [];
        if (filter.type === 'axis') {
            const axis = model.find(e => e.id === filter.id);
            if (axis) {
                labels = axis.subgrupos.filter(s => !s.hidden).map(s => s.nome);
                data = axis.subgrupos.filter(s => !s.hidden).map(s => calcScore(slotRespostas, s.perguntas.filter(p => !p.hidden)));
            }
        } else if (filter.type === 'role') {
            labels = model.filter(e => !e.hidden).map(e => e.nome);
            data = model.filter(e => !e.hidden).map(axis => {
                const roleQs = [];
                axis.subgrupos.forEach(s => s.perguntas.forEach(p => { if (!p.hidden && p.papel === filter.id) roleQs.push(p); }));
                return calcScore(slotRespostas, roleQs);
            });
        } else {
            labels = model.filter(e => !e.hidden).map(e => e.nome);
            data = model.filter(e => !e.hidden).map(axis => {
                const allQs = [];
                axis.subgrupos.forEach(s => s.perguntas.forEach(p => { if (!p.hidden) allQs.push(p); }));
                return calcScore(slotRespostas, allQs);
            });
        }
        return { labels, datasets: [{ label: slotData.assessmentName, data, backgroundColor: bg, borderColor: color, borderWidth: 1 }] };
    };

    const getQuestionsByScore = () => {
        const list = [];
        model.forEach(axis => {
            if (axis.hidden) return;
            axis.subgrupos.forEach(sub => {
                if (sub.hidden) return;
                sub.perguntas.forEach(p => {
                    if (p.hidden) return;
                    const val = respostas[p.id] || 0;
                    if (val === scoreFilter) list.push({ ...p, eixo: axis.nome, sub: sub.nome });
                });
            });
        });
        return list;
    };
    const filteredQuestions = getQuestionsByScore();

    return (
        <div className="space-y-8 animate-fade pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center bg-blue-900/20 p-4 rounded-xl border border-blue-800 gap-4">
                <div>
                    <h2 className="text-xl font-cinzel text-white">Painel de Métricas</h2>
                    <p className="text-[10px] text-blue-400">Analise os eixos, papéis e compare cenários.</p>
                </div>
                <div className="text-right bg-slate-900/50 p-2 rounded-lg border border-blue-800/50">
                    <span className="text-[8px] uppercase tracking-widest text-blue-500 block">Filtro Dinâmico Ativo</span>
                    <span className="text-sm font-bold text-amber-400">{filter.label}</span>
                    {filter.type !== 'geral' && (
                        <button onClick={() => setFilter({ type: 'geral', id: null, label: 'Visão Geral' })}
                            className="ml-2 px-2 py-0.5 rounded bg-red-900/30 text-[8px] text-red-400 hover:text-white hover:bg-red-900 transition-all">
                            <i className="fas fa-times mr-1"></i>Limpar
                        </button>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 border-b border-blue-800 pb-2"><i className="fas fa-crosshairs mr-2"></i>1. Detalhe por Eixo (Clique para Filtrar)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {axesCharts.map(chart => (
                        <div key={chart.id} onClick={() => setFilter({ type: 'axis', id: chart.id, label: `Eixo: ${chart.title}` })}
                            className={`h-56 bg-slate-800/50 p-2 rounded-xl border transition-all cursor-pointer ${filter.id === chart.id ? 'border-amber-500 ring-1 ring-amber-500/50 bg-blue-900/40' : 'border-blue-800/30 hover:border-blue-500'}`}>
                            <div className="text-center font-cinzel text-[10px] text-blue-100 mb-1">{chart.title}</div>
                            <div className="h-44"><ChartComponent type="radar" data={chart.chartData} options={commonOptions} /></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                    <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 border-b border-blue-800 pb-2"><i className="fas fa-users mr-2"></i>2. Comparativo de Papéis</h3>
                    <div className="h-80 bg-slate-800/50 p-4 rounded-xl border border-blue-800">
                        <ChartComponent type="radar" data={roleChartData} options={{ ...commonOptions, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
                <div className="md:col-span-1 flex flex-col justify-center gap-2">
                    <div className="text-[9px] text-blue-500 uppercase font-bold text-center mb-2">Filtrar por Papel</div>
                    <button onClick={() => setFilter({ type: 'geral', id: null, label: 'Visão Geral' })} className={`p-2 rounded text-[9px] border ${filter.type === 'geral' ? 'bg-amber-600 text-white border-amber-400' : 'bg-blue-900/20 text-blue-400 border-blue-800'}`}>TODOS OS PAPÉIS</button>
                    {activeRoles.map((r, idx) => (
                        <button key={r.id} onClick={() => setFilter({ type: 'role', id: r.nome, label: `Papel: ${r.nome}` })}
                            className={`flex items-center gap-2 p-2 rounded text-[9px] transition-all border ${filter.id === r.nome ? 'bg-blue-800 border-amber-500 text-white' : 'bg-blue-900/20 border-transparent text-blue-300 hover:bg-blue-900'}`}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsla(${210 + (idx * 30)}, 70%, 50%, 1)` }}></span>
                            {r.nome}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 border-b border-blue-800 pb-2 flex justify-between">
                    <span><i className="fas fa-scale-balanced mr-2"></i>3. Comparador ({filter.label})</span>
                    <span className="text-[8px] opacity-50 lowercase">Clique nos cartões vazios para carregar</span>
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map(idx => {
                        const slotData = slots[idx];
                        const chartData = getSlotData(slotData);

                        return (
                            <div key={`slot-${idx}`} className="relative bg-slate-900 rounded-xl border border-blue-900 overflow-hidden flex flex-col h-96">
                                <div className="flex justify-between items-center bg-slate-800 p-1 px-2 border-b border-blue-900">
                                    <div className="text-[8px] font-black text-blue-400 truncate max-w-[80px]">
                                        {slotData ? (slotData.clientName || "ATUAL") : "VAZIO"}
                                    </div>
                                    <button onClick={() => setTargetSlot(idx)} className="text-[8px] bg-blue-800 hover:bg-blue-600 text-white px-1.5 rounded transition-colors" title="Carregar Avaliação">
                                        <i className={`fas ${slotData ? 'fa-sync' : 'fa-plus'}`}></i>
                                    </button>
                                </div>
                                <div className="flex-grow flex items-center justify-center p-2">
                                    {slotData && chartData ? (
                                        <div className="w-full h-full relative">
                                            <div className="absolute top-0 w-full text-center text-[8px] text-white opacity-60 truncate">{slotData.assessmentName}</div>
                                            <div className="pt-4 h-full">
                                                <ChartComponent type="radar" data={chartData} options={{ ...commonOptions, scales: { r: { ...commonOptions.scales.r, pointLabels: { display: false } } } }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setTargetSlot(idx)} className="text-blue-800 hover:text-blue-500 transition-colors flex flex-col items-center gap-2">
                                            <i className="fas fa-plus-circle text-2xl"></i>
                                            <span className="text-[8px] uppercase font-bold">Adicionar</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-12 bg-slate-800/50 border border-blue-800 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
                    <div className="flex-grow">
                        <h3 className="text-lg font-cinzel text-white mb-1">Explorador de Respostas</h3>
                        <p className="text-[10px] text-blue-400">Arraste o controle para filtrar perguntas pela nota atribuída.</p>
                    </div>
                    <div className="w-full md:w-64 bg-slate-900/50 p-4 rounded-lg border border-blue-700">
                        <div className="flex justify-between text-[10px] font-bold text-white mb-2 uppercase">
                            <span>Nota Selecionada</span>
                            <span className="text-amber-400 text-lg">{RATING_MAP[scoreFilter]}</span>
                        </div>
                        <input
                            type="range" min="0" max="5" step="1"
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        />
                        <div className="flex justify-between text-[8px] text-blue-600 mt-1 font-mono">
                            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto custom-scroll pr-2">
                    {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
                        <div key={`q-filter-${q.id}`} className="flex items-center gap-3 bg-blue-900/20 p-3 rounded border border-blue-800/50 hover:border-blue-500 transition-colors">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border 
                                ${scoreFilter >= 4.5 ? 'bg-blue-900 text-blue-400 border-blue-600' :
                                    scoreFilter >= 2.5 ? 'bg-yellow-900 text-yellow-400 border-yellow-600' :
                                        'bg-red-900 text-red-400 border-red-600'}`}>
                                {scoreFilter}
                            </div>
                            <div className="flex-grow">
                                <div className="text-[9px] text-blue-500 uppercase font-bold mb-0.5">{q.eixo} <span className="text-blue-700">/</span> {q.sub}</div>
                                <div className="text-[10px] text-white leading-tight">{q.texto}</div>
                            </div>
                            <div className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-black/30 rounded text-blue-500 border border-blue-900">
                                {q.papel}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-blue-800 italic text-xs uppercase tracking-widest">
                            Nenhuma pergunta encontrada com a nota {scoreFilter}.
                        </div>
                    )}
                </div>
            </div>

            <ComparisonModal
                isOpen={targetSlot !== null}
                onClose={() => setTargetSlot(null)}
                onSelect={(assessment) => {
                    const newSlots = [...slots];
                    newSlots[targetSlot] = assessment;
                    setSlots(newSlots);
                    setTargetSlot(null);
                }}
            />
        </div>
    );
};

// --- ABA QUESTIONÁRIO ---
const QuestionnaireTab = ({ model, setModel, roles, setRoles, respostas, setRespostas, handleSaveSettings }) => {
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [isEdit, setIsEdit] = React.useState(false);
    const active = model[activeIdx];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade">
            <div className="md:col-span-1">
                <div className={`bg-slate-800/80 p-4 rounded-xl border ${isEdit ? 'border-amber-600 border-dashed' : 'border-blue-800 shadow-xl'}`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">Navegação</span>
                        {isEdit && <button onClick={() => setModel([...model, { id: generateId(), nome: 'Novo Eixo', hidden: false, subgrupos: [] }])} className="text-blue-500 hover:text-white transition-colors"><i className="fas fa-plus"></i></button>}
                    </div>
                    <div className="space-y-1 mb-4">
                        {model.map((e, idx) => (
                            (!e.hidden || isEdit) && (
                                <div key={`nav-item-${e.id}`} className="group relative flex items-center">
                                    <button onClick={() => setActiveIdx(idx)} className={`flex-grow text-left p-2 rounded-lg text-[9px] transition-all ${activeIdx === idx ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-800/50 text-blue-100/60'} ${e.hidden ? 'opacity-40 italic' : ''}`}>
                                        {e.nome} {e.hidden && <i className="fas fa-eye-slash ml-1"></i>}
                                    </button>
                                    {isEdit && (
                                        <div className="absolute right-1 flex gap-1 opacity-0 group-hover:opacity-100 bg-blue-900 p-1 rounded shadow-lg transition-all">
                                            <button onClick={() => setModel(moveInArray(model, idx, -1))} title="Subir"><i className="fas fa-chevron-up text-[7px]"></i></button>
                                            <button onClick={() => setModel(moveInArray(model, idx, 1))} title="Descer"><i className="fas fa-chevron-down text-[7px]"></i></button>
                                            <button onClick={() => { const n = prompt("Nome:", e.nome); if (n) { const nm = [...model]; nm[idx].nome = n; setModel(nm); } }} className="text-amber-400"><i className="fas fa-edit text-[7px]"></i></button>
                                            <button onClick={() => { const nm = [...model]; nm[idx].hidden = !nm[idx].hidden; setModel(nm); }}><i className={`fas fa-eye${e.hidden ? '-slash' : ''} text-[7px]`}></i></button>
                                            <button onClick={() => { if (confirm("Eliminar eixo?")) setModel(model.filter((_, i) => i !== idx)); }} className="text-red-400"><i className="fas fa-trash text-[7px]"></i></button>
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                    {isEdit && (
                        <div className="mb-4 pb-4 border-b border-blue-800">
                            <span className="text-[8px] font-bold text-blue-500 uppercase block mb-2">Papéis</span>
                            <div className="flex flex-wrap gap-1">
                                {roles.map((r, ri) => (
                                    <div key={`rmgr-${r.id}`} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] border ${r.hidden ? 'bg-black opacity-40' : 'bg-blue-800 text-white'}`}>
                                        {r.nome}
                                        <button onClick={() => { const nr = [...roles]; nr[ri].hidden = !nr[ri].hidden; setRoles(nr); }}><i className={`fas fa-eye${r.hidden ? '-slash' : ''}`}></i></button>
                                        <button onClick={() => { if (confirm("Eliminar papel?")) setRoles(roles.filter((_, i) => i !== ri)); }} className="text-red-400"><i className="fas fa-times"></i></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => { const n = prompt("Novo Papel:"); if (n) setRoles([...roles, { id: generateId(), nome: n, hidden: false }]); }} className="w-full mt-2 bg-blue-900/60 text-blue-400 text-[8px] py-1 rounded border border-blue-700 hover:bg-blue-800 transition-colors">+ PAPEL</button>
                        </div>
                    )}
                    <div className="space-y-2">
                        <button onClick={() => setIsEdit(!isEdit)} className={`w-full py-2 rounded-lg text-[8px] font-bold uppercase transition-all ${isEdit ? 'bg-amber-600 text-white' : 'bg-blue-900/60 text-blue-500 border border-blue-800 hover:bg-blue-800'}`}>
                            {isEdit ? "Finalizar Edição" : "Editar Estrutura"}
                        </button>
                        {isEdit && <button onClick={handleSaveSettings} className="w-full bg-blue-500 text-white py-2 rounded-lg text-[8px] font-bold uppercase btn-interativo">Guardar Estrutura</button>}
                    </div>
                </div>
            </div>

            <div className="md:col-span-3 space-y-4">
                {active ? (
                    <div>
                        <h2 className="text-lg font-cinzel text-white uppercase mb-4 tracking-tighter">{active.nome}</h2>
                        {active.subgrupos.map((sub, sIdx) => (
                            (!sub.hidden || isEdit) && (
                                <div key={`subgroup-${sub.id}`} className={`bg-slate-800/60 p-4 rounded-xl border ${sub.hidden ? 'opacity-40 border-dashed border-blue-900' : 'border-blue-800'} mb-4 shadow-sm`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-blue-400 text-xs">{sub.nome}</h4>
                                        {isEdit && (
                                            <div className="flex gap-2">
                                                <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos = moveInArray(nm[activeIdx].subgrupos, sIdx, -1); setModel(nm); }}><i className="fas fa-arrow-up text-[8px]"></i></button>
                                                <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos = moveInArray(nm[activeIdx].subgrupos, sIdx, 1); setModel(nm); }}><i className="fas fa-arrow-down text-[8px]"></i></button>
                                                <button onClick={() => { const n = prompt("Nome:", sub.nome); if (n) { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].nome = n; setModel(nm); } }} className="text-amber-500"><i className="fas fa-edit text-[8px]"></i></button>
                                                <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].hidden = !nm[activeIdx].subgrupos[sIdx].hidden; setModel(nm); }}><i className="fas fa-eye text-[8px]"></i></button>
                                                <button onClick={() => { if (confirm("Remover subgrupo?")) { const nm = [...model]; nm[activeIdx].subgrupos.splice(sIdx, 1); setModel(nm); } }} className="text-red-400"><i className="fas fa-trash text-[8px]"></i></button>
                                                <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas.push({ id: generateId(), texto: "Nova Pergunta", papel: roles.filter(r => !r.hidden)[0]?.nome || "Time", hidden: false }); setModel(nm); }} className="bg-blue-500 text-white px-2 py-0.5 rounded text-[7px] font-bold uppercase transition-all hover:bg-blue-400">Add Pergunta</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {sub.perguntas.map((q, pIdx) => (
                                            (!q.hidden || isEdit) && (
                                                <div key={`q-item-${q.id}`} className={`flex flex-col md:flex-row items-center gap-3 bg-slate-900/60 p-2 rounded-lg border ${q.hidden ? 'opacity-40 border-dashed border-blue-900' : 'border-blue-800/30'}`}>
                                                    <div className="flex-grow w-full">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {isEdit ? (
                                                                <select
                                                                    value={q.papel}
                                                                    onChange={(e) => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas[pIdx].papel = e.target.value; setModel(nm); }}
                                                                    className="bg-slate-800 text-blue-400 text-[7px] font-black uppercase rounded p-1 border border-blue-700 outline-none"
                                                                >
                                                                    {roles.filter(r => !r.hidden).map(r => (
                                                                        <option key={`opt-${q.id}-${r.id}`} value={r.nome}>{r.nome}</option>
                                                                    ))}
                                                                </select>
                                                            ) : <span className="text-[7px] text-blue-500 uppercase font-black tracking-widest">{q.papel}</span>}
                                                            {isEdit && (
                                                                <div className="flex gap-1 ml-auto">
                                                                    <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas = moveInArray(nm[activeIdx].subgrupos[sIdx].perguntas, pIdx, -1); setModel(nm); }}><i className="fas fa-chevron-up text-[7px]"></i></button>
                                                                    <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas = moveInArray(nm[activeIdx].subgrupos[sIdx].perguntas, pIdx, 1); setModel(nm); }}><i className="fas fa-chevron-down text-[7px]"></i></button>
                                                                    <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas[pIdx].hidden = !nm[activeIdx].subgrupos[sIdx].perguntas[pIdx].hidden; setModel(nm); }} className="text-blue-500"><i className="fas fa-eye text-[7px]"></i></button>
                                                                    <button onClick={() => { if (confirm("Remover pergunta?")) { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas.splice(pIdx, 1); setModel(nm); } }} className="text-red-500"><i className="fas fa-trash text-[7px]"></i></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isEdit ? (
                                                            <input className="w-full bg-transparent text-[10px] text-blue-50 outline-none border-b border-blue-800" value={q.texto} onChange={(e) => { const nm = [...model]; nm[activeIdx].subgrupos[sIdx].perguntas[pIdx].texto = e.target.value; setModel(nm); }} />
                                                        ) : <div className="text-[10px] text-blue-50 font-medium leading-tight">{q.texto}</div>}
                                                    </div>
                                                    {!isEdit && (
                                                        <select value={respostas[q.id] || 0} onChange={(e) => setRespostas({ ...respostas, [q.id]: parseInt(e.target.value) })} className="bg-slate-900 border border-blue-800 text-white p-1 rounded text-[9px] w-24 outline-none cursor-pointer hover:border-blue-600 transition-colors">
                                                            {Object.entries(RATING_MAP).map(([v, l]) => <option key={`v-${q.id}-${v}`} value={v}>{l}</option>)}
                                                        </select>
                                                    )}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                        {isEdit && (
                            <button onClick={() => { const nm = [...model]; nm[activeIdx].subgrupos.push({ id: generateId(), nome: "Novo Subgrupo", hidden: false, perguntas: [] }); setModel(nm); }} className="w-full py-2 border border-dashed border-blue-800 rounded-xl text-[8px] text-blue-700 hover:text-blue-400 font-bold uppercase transition-all">+ Subgrupo</button>
                        )}
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-blue-900 italic uppercase tracking-[0.2em] opacity-30">Selecione um eixo estratégico</div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE AUXILIAR: LISTA EXPANSÍVEL ---
const ExpandableList = ({ title, count, items, colorClass, icon }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className={`mb-2 rounded-lg border ${colorClass} bg-opacity-10 bg-black`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-2 px-3 hover:bg-white/5 transition-colors rounded-lg">
                <div className="flex items-center gap-2">
                    <i className={`fas ${icon}`}></i>
                    <span className="text-[9px] font-bold uppercase tracking-widest">{title}</span>
                    <span className={`text-[9px] font-black px-1.5 rounded-full ${colorClass.replace('border', 'bg').replace('/30', '')} text-black`}>{count}</span>
                </div>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-[9px] opacity-50`}></i>
            </button>
            {isOpen && (
                <div className="p-3 border-t border-white/10 max-h-40 overflow-y-auto custom-scroll space-y-1">
                    {items.length > 0 ? items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start gap-2 text-[9px] text-blue-100/70 border-b border-white/5 pb-1 last:border-0">
                            <span>{item.texto}</span>
                            <span className="font-mono opacity-50 whitespace-nowrap">({item.nota})</span>
                        </div>
                    )) : <div className="text-[8px] italic opacity-40">Nenhum item neste critério.</div>}
                </div>
            )}
        </div>
    );
};

// --- NOVA ABA: PLANOS DE AÇÃO ---
const ActionPlanTab = ({ model, respostas, activeAss }) => {
    const [generalNotes, setGeneralNotes] = React.useState("");
    const [keepDoing, setKeepDoing] = React.useState("");
    const [improvements, setImprovements] = React.useState("");
    const [ruleComments, setRuleComments] = React.useState({});
    const [selectedRuleId, setSelectedRuleId] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [customRules, setCustomRules] = React.useState([]);

    const DEFAULT_RULE = { targetId: "GLOBAL", operator: "<", value: 3, text: "" };
    const [ruleForm, setRuleForm] = React.useState(DEFAULT_RULE);
    const [editingId, setEditingId] = React.useState(null);

    React.useEffect(() => {
        if (activeAss && activeAss.planoAcao) {
            setGeneralNotes(activeAss.planoAcao.generalNotes || "");
            setKeepDoing(activeAss.planoAcao.keepDoing || "");
            setImprovements(activeAss.planoAcao.improvements || "");
            setRuleComments(activeAss.planoAcao.ruleComments || {});
        }
    }, [activeAss]);

    React.useEffect(() => {
        db.collection("radar_v3_config").doc("analysis_rules").get().then(doc => {
            if (doc.exists) setCustomRules(doc.data().rules || []);
        });
    }, []);

    const handleSaveRule = async () => {
        if (!ruleForm.text) return alert("Digite a mensagem da análise.");
        let updatedRules = [...customRules];

        if (editingId) {
            updatedRules = updatedRules.map(r => r.id === editingId ? { ...ruleForm, id: editingId } : r);
            alert("Regra atualizada com sucesso!");
        } else {
            updatedRules.push({ id: generateId(), ...ruleForm });
        }

        setCustomRules(updatedRules);
        setRuleForm(DEFAULT_RULE);
        setEditingId(null);
        await db.collection("radar_v3_config").doc("analysis_rules").set({ rules: updatedRules }, { merge: true });
    };

    const handleEditClick = (rule) => {
        setRuleForm({ targetId: rule.targetId, operator: rule.operator, value: rule.value, text: rule.text });
        setEditingId(rule.id);
        document.getElementById('rule-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setRuleForm(DEFAULT_RULE);
        setEditingId(null);
    };

    const handleDeleteRule = async (id) => {
        if (!confirm("Tem certeza que deseja remover esta regra permanentemente?")) return;
        const updatedRules = customRules.filter(r => r.id !== id);
        setCustomRules(updatedRules);
        if (editingId === id) handleCancelEdit();
        await db.collection("radar_v3_config").doc("analysis_rules").set({ rules: updatedRules }, { merge: true });
    };

    const flatQuestions = React.useMemo(() => {
        let list = [];
        model.forEach(e => !e.hidden && e.subgrupos.forEach(s => !s.hidden && s.perguntas.forEach(p => !p.hidden && list.push({ ...p, eixo: e.nome }))));
        return list;
    }, [model]);

    const globalAverage = React.useMemo(() => {
        let sum = 0, count = 0;
        flatQuestions.forEach(q => { if (respostas[q.id]) { sum += respostas[q.id]; count++; } });
        return count > 0 ? (sum / count) : 0;
    }, [flatQuestions, respostas]);

    const triggeredRules = React.useMemo(() => {
        return customRules.map(rule => {
            let matches = [];
            if (rule.targetId === 'GLOBAL') {
                const val = globalAverage;
                const match = (rule.operator === '<' && val < rule.value) ||
                    (rule.operator === '>' && val > rule.value) ||
                    (rule.operator === '<=' && val <= rule.value) ||
                    (rule.operator === '>=' && val >= rule.value) ||
                    (rule.operator === '==' && val == rule.value);
                if (match) matches.push({ nome: "MÉDIA GERAL DO RADAR", nota: val.toFixed(1) });
            } else {
                const q = flatQuestions.find(q => q.id === rule.targetId);
                if (q) {
                    const val = respostas[q.id] || 0;
                    if (val > 0) {
                        const match = (rule.operator === '<' && val < rule.value) ||
                            (rule.operator === '>' && val > rule.value) ||
                            (rule.operator === '<=' && val <= rule.value) ||
                            (rule.operator === '>=' && val >= rule.value) ||
                            (rule.operator === '==' && val == rule.value);
                        if (match) matches.push({ nome: `[${q.eixo}] ${q.texto}`, nota: val });
                    }
                }
            }
            return { ...rule, matches };
        }).filter(r => r.matches.length > 0);
    }, [customRules, globalAverage, respostas, flatQuestions]);

    const analyzeData = React.useMemo(() => {
        let strengths = [], weaknesses = [];
        flatQuestions.forEach(q => {
            const val = respostas[q.id] || 0;
            const item = { ...q, nota: RATING_MAP[val] };
            if (val > 3) strengths.push(item);
            else if (val > 0) weaknesses.push(item);
        });
        return { strengths, weaknesses };
    }, [flatQuestions, respostas]);

    const currentRule = triggeredRules.find(r => r.id === selectedRuleId);

    const copyPrompt = () => {
        const prompt = `
ATUE COMO UM AGILE COACH SÊNIOR.
Analise os dados do cliente "${activeAss?.clientName || 'Cliente'}".

1. CONTEXTO DO LÍDER: "${generalNotes || 'N/A'}"

2. ANÁLISE AUTOMÁTICA & OBSERVAÇÕES ESPECÍFICAS:
${triggeredRules.length > 0 ? triggeredRules.map(r => {
            const comment = ruleComments[r.id] ? `\n   -> OBSERVAÇÃO DO ESPECIALISTA: "${ruleComments[r.id]}"` : "";
            return `ALERTA: "${r.text}" (Critério: ${r.operator} ${r.value}) detectado em: ${r.matches.map(m => `${m.nome} (Nota: ${m.nota})`).join(', ')}.${comment}`;
        }).join('\n\n') : 'Nenhuma regra específica de alerta foi gatilhada.'}

3. DADOS QUANTITATIVOS:
TOP PONTOS FORTES:
${analyzeData.strengths.slice(0, 10).map(i => `- ${i.texto} (${i.nota})`).join('\n')}

OPORTUNIDADES DE MELHORIA:
${analyzeData.weaknesses.slice(0, 15).map(i => `- ${i.texto} (${i.nota})`).join('\n')}

GERE UM PLANO DE AÇÃO CONTENDO:
- Sumário Executivo.
- Ações para os Alertas do Especialista (Prioridade Máxima), considerando as observações manuais.
- Quick Wins baseados nas oportunidades.
`.trim();
        navigator.clipboard.writeText(prompt);
        alert("Prompt copiado!");
    };

    const handleSaveNotes = async () => {
        if (!activeAss || !activeAss.id) return alert("Salve a avaliação primeiro.");
        setIsSaving(true);
        await db.collection("radar_v3_respostas").doc(activeAss.id).set({
            planoAcao: { generalNotes, keepDoing, improvements, ruleComments }
        }, { merge: true });
        setIsSaving(false);
        alert("Todas as anotações e análises foram salvas!");
    };

    return (
        <div className="animate-fade pb-20 space-y-8">
            <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-cinzel text-white">Plano de Ação & Insights</h2>
                    <p className="text-[10px] text-blue-400">Estruture os próximos passos com apoio de dados e IA.</p>
                </div>
                <button onClick={copyPrompt} className="bg-gradient-to-r from-purple-800 to-indigo-900 border border-purple-500/50 hover:border-purple-300 text-white px-6 py-3 rounded-xl shadow-xl transition-all">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-magic text-xl animate-pulse"></i>
                        <div className="text-left">
                            <div className="text-[8px] font-bold uppercase tracking-widest text-purple-300">Inteligência Artificial</div>
                            <div className="text-xs font-bold">Gerar Prompt Analítico</div>
                        </div>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-800/50 p-1 rounded-xl border border-blue-800">
                        <div className="p-3 border-b border-blue-900/50 mb-2 flex gap-2 text-blue-400">
                            <i className="fas fa-user-edit"></i><h3 className="font-cinzel text-sm uppercase">Notas do Líder</h3>
                        </div>
                        <textarea value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} placeholder="Contexto..." className="w-full h-32 bg-transparent text-[10px] text-blue-100 p-3 outline-none resize-none" />
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-blue-800 relative group focus-within:border-blue-500 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <i className="fas fa-microscope text-blue-400"></i>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Aprofundamento em Regras Ativas ({triggeredRules.length})</span>
                        </div>

                        {triggeredRules.length > 0 ? (
                            <>
                                <select
                                    value={selectedRuleId}
                                    onChange={(e) => setSelectedRuleId(e.target.value)}
                                    className="w-full bg-black/40 border border-blue-800 text-white text-[10px] p-2 rounded mb-2 outline-none focus:border-blue-500"
                                >
                                    <option value="">Selecione uma regra ativa para comentar...</option>
                                    {triggeredRules.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.text.substring(0, 50)}...
                                        </option>
                                    ))}
                                </select>

                                {selectedRuleId && currentRule ? (
                                    <div className="animate-fade">
                                        <div className="text-[9px] text-blue-500/70 mb-1 ml-1">
                                            Análise sobre: <span className="text-white font-bold">"{currentRule.text}"</span>
                                        </div>
                                        <textarea
                                            value={ruleComments[selectedRuleId] || ""}
                                            onChange={(e) => setRuleComments({ ...ruleComments, [selectedRuleId]: e.target.value })}
                                            className="w-full h-24 bg-black/20 rounded-lg text-[10px] text-blue-50 p-3 outline-none resize-none border border-transparent focus:border-blue-500/30 placeholder-blue-800/50"
                                            placeholder="Sua observação técnica sobre este ponto específico..."
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 flex items-center justify-center text-[9px] text-blue-800 italic border border-dashed border-blue-900/50 rounded-lg">
                                        Selecione uma regra no menu acima para adicionar observações.
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-[9px] text-blue-700 italic">Nenhuma regra foi gatilhada pelos dados atuais.</div>
                        )}
                    </div>

                    <button onClick={handleSaveNotes} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-xs font-bold uppercase shadow-lg tracking-widest flex justify-center items-center gap-2">
                        {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                        {isSaving ? "Salvando..." : "Salvar Todas as Análises"}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-xl" id="rule-form-anchor">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-cinzel text-blue-100 flex items-center gap-2">
                                <i className="fas fa-ruler-combined"></i>
                                {editingId ? "Editando Regra" : "Minha Régua de Análise"}
                            </h3>
                            <div className="text-[9px] bg-blue-900/50 text-blue-300 px-2 py-1 rounded">Config Global</div>
                        </div>

                        <div className={`p-4 rounded-lg border space-y-3 mb-6 transition-all ${editingId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Alvo</label>
                                    <select value={ruleForm.targetId} onChange={e => setRuleForm({ ...ruleForm, targetId: e.target.value })} className="w-full bg-slate-900 border border-slate-600 text-white text-[9px] p-2 rounded">
                                        <option value="GLOBAL">Aplicar à Média Geral</option>
                                        <optgroup label="Quesitos Específicos">
                                            {flatQuestions.map(q => <option key={q.id} value={q.id}>[{q.eixo}] {q.texto.substring(0, 40)}...</option>)}
                                        </optgroup>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Condição</label>
                                    <div className="flex gap-1">
                                        <select value={ruleForm.operator} onChange={e => setRuleForm({ ...ruleForm, operator: e.target.value })} className="bg-slate-900 border border-slate-600 text-white text-[9px] p-2 rounded w-1/2">
                                            <option value="<">&lt; Menor</option>
                                            <option value="<=">&le; Menor/Igual</option>
                                            <option value="==">= Igual</option>
                                            <option value=">">&gt; Maior</option>
                                            <option value=">=">&ge; Maior/Igual</option>
                                        </select>
                                        <input type="number" step="0.1" min="0" max="5" value={ruleForm.value} onChange={e => setRuleForm({ ...ruleForm, value: e.target.value })} className="bg-slate-900 border border-slate-600 text-white text-[9px] p-2 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Mensagem (Insight)</label>
                                <input type="text" value={ruleForm.text} onChange={e => setRuleForm({ ...ruleForm, text: e.target.value })} placeholder="Ex: ALERTA: Processo Zumbi detectado..." className="w-full bg-slate-900 border border-slate-600 text-white text-[10px] p-2 rounded" />
                            </div>

                            <div className="flex gap-2">
                                {editingId && (
                                    <button onClick={handleCancelEdit} className="w-1/3 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-[9px] font-bold uppercase transition-colors">Cancelar</button>
                                )}
                                <button onClick={handleSaveRule} className={`flex-grow py-2 rounded text-[10px] font-bold uppercase transition-colors text-white ${editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                    {editingId ? "Atualizar Regra" : "Adicionar Nova Regra"}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-80 overflow-y-auto custom-scroll">
                            {customRules.length === 0 && <div className="text-center text-slate-500 text-[10px] italic">Nenhuma regra cadastrada.</div>}
                            {customRules.map((rule, idx) => {
                                let targetName = "MÉDIA GERAL";
                                if (rule.targetId !== 'GLOBAL') {
                                    const q = flatQuestions.find(q => q.id === rule.targetId);
                                    targetName = q ? `[${q.eixo}] ${q.texto.substring(0, 20)}...` : "Perg. Removida";
                                }

                                return (
                                    <div key={idx} className={`flex justify-between items-start bg-slate-800 p-3 rounded border-l-4 ${editingId === rule.id ? 'border-amber-500 bg-slate-700' : 'border-blue-500'}`}>
                                        <div className="flex-grow pr-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-black bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 uppercase">{targetName}</span>
                                                <span className="text-[9px] font-bold text-slate-400">{rule.operator} {rule.value}</span>
                                            </div>
                                            <div className="text-[10px] text-white leading-tight">{rule.text}</div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => handleEditClick(rule)} className="text-amber-400 hover:text-amber-200" title="Editar"><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={() => handleDeleteRule(rule.id)} className="text-red-400 hover:text-red-200" title="Excluir"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-blue-800">
                        <ExpandableList title="Pontos Fortes (>3)" count={analyzeData.strengths.length} items={analyzeData.strengths} colorClass="border-blue-500/30 text-blue-400" icon="fa-thumbs-up" />
                        <textarea value={keepDoing} onChange={(e) => setKeepDoing(e.target.value)} className="w-full h-20 bg-black/20 rounded-lg text-[10px] text-blue-50 p-3 mt-2 outline-none resize-none" placeholder="Ações para manter..." />
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-blue-800">
                        <ExpandableList title="Oportunidades (<=3)" count={analyzeData.weaknesses.length} items={analyzeData.weaknesses} colorClass="border-amber-600/30 text-amber-400" icon="fa-exclamation-triangle" />
                        <textarea value={improvements} onChange={(e) => setImprovements(e.target.value)} className="w-full h-20 bg-black/20 rounded-lg text-[10px] text-blue-50 p-3 mt-2 outline-none resize-none" placeholder="Ações para corrigir..." />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const MainApp = () => {
    const [tab, setTab] = React.useState('questionario');
    const [model, setModel] = React.useState([]);
    const [roles, setRoles] = React.useState([]);
    const [respostas, setRespostas] = React.useState({});
    const [isImport, setIsImport] = React.useState(false);
    const [activeAss, setActiveAss] = React.useState(null);
    const [helpOpen, setHelpOpen] = React.useState(false);

    React.useEffect(() => {
        const unsub = db.collection("radar_v3_config").doc("global").onSnapshot(d => {
            if (d.exists) {
                const data = d.data();
                setModel(data.model || []);
                setRoles(sanitizeRoles(data.roles));
            }
        });
        return () => unsub();
    }, []);

    const handleSaveSettings = async () => {
        try {
            await db.collection("radar_v3_config").doc("global").set({ model, roles, dataModificacao: firebase.firestore.FieldValue.serverTimestamp() });
            alert("Estrutura guardada com sucesso!");
        } catch (e) { alert("Erro ao guardar: " + e.message); }
    };

    const handleSaveAnswers = async () => {
        try {
            let cName = activeAss?.clientName, aName = activeAss?.assessmentName;
            let isUpdate = false;

            if (activeAss) {
                isUpdate = confirm(`Deseja ATUALIZAR a avaliação ativa [${activeAss.assessmentName}]?\n(Clique em CANCELAR para salvar como uma melhoria/nova)`);
                if (!isUpdate) {
                    aName = prompt("Nome da Nova Melhoria:", activeAss.assessmentName + " (v2)");
                    if (!aName) return;
                }
            } else {
                cName = prompt("Nome do Cliente:"); if (!cName) return;
                aName = prompt("Nome da Avaliação:"); if (!aName) return;
            }

            const data = { clientName: cName, assessmentName: aName, respostas, dataAvaliacao: firebase.firestore.FieldValue.serverTimestamp() };

            if (isUpdate && activeAss) {
                await db.collection("radar_v3_respostas").doc(activeAss.id).update({ respostas, dataModificacao: firebase.firestore.FieldValue.serverTimestamp() });
                alert("Avaliação Atualizada!");
            } else {
                const doc = await db.collection("radar_v3_respostas").add(data);
                await db.collection("radar_v3_clientes").doc(cName).set({ createdAt: new Date() }, { merge: true });
                setActiveAss({ id: doc.id, clientName: cName, assessmentName: aName });
                alert("Nova Avaliação/Melhoria Guardada!");
            }
        } catch (e) { alert("Erro ao salvar: " + e.message); }
    };

    const handleNew = () => {
        if (confirm("Deseja limpar as respostas atuais para iniciar uma nova avaliação?")) {
            setRespostas({});
            setActiveAss(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a]">
            <header className="bg-slate-900 p-4 border-b border-blue-900 sticky top-0 z-50 shadow-xl">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-cinzel text-white tracking-widest leading-none">RADAR MATURIDADE</h1>
                        <div className={`text-[8px] font-black uppercase mt-1 tracking-widest ${activeAss ? 'text-amber-500' : 'text-blue-500'}`}>
                            {activeAss ? (
                                <span><i className="fas fa-pen mr-1"></i> EDITANDO: {activeAss.clientName} - {activeAss.assessmentName}</span>
                            ) : <span><i className="fas fa-file-circle-plus mr-1"></i> NOVA AVALIAÇÃO</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setHelpOpen(true)} className="w-8 h-8 rounded-full bg-slate-800 text-blue-300 border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-white transition-all font-bold shadow-lg flex items-center justify-center" title="Guia de Uso">
                            <i className="fas fa-question text-xs"></i>
                        </button>
                        <button onClick={handleNew} className="bg-slate-800 p-2 px-3 rounded-lg text-blue-400 hover:text-white transition-all text-[9px] font-black uppercase" title="Novo">Nova</button>
                        <button onClick={() => setIsImport(true)} className="bg-blue-900/50 p-2 px-4 rounded-lg text-[9px] font-bold uppercase text-blue-100 hover:bg-blue-800 transition-all">Importar</button>
                        <button onClick={handleSaveAnswers} className="bg-blue-500 text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase btn-interativo shadow-lg">Salvar</button>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-6xl mx-auto w-full p-4">
                <div className="flex gap-6 mb-6 border-b border-blue-900/50">
                    <button onClick={() => setTab('questionario')} className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'questionario' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-900 opacity-40 hover:opacity-100'}`}>Questionário</button>
                    <button onClick={() => setTab('radar')} className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'radar' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-900 opacity-40 hover:opacity-100'}`}>Resultados</button>
                    <button onClick={() => setTab('plano_acao')} className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'plano_acao' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-900 opacity-40 hover:opacity-100'}`}>Planos de Ação</button>
                </div>

                {tab === 'questionario' ? (
                    <QuestionnaireTab
                        model={model} setModel={setModel}
                        roles={roles} setRoles={setRoles}
                        respostas={respostas} setRespostas={setRespostas}
                        handleSaveSettings={handleSaveSettings}
                    />
                ) : tab === 'radar' ? (
                    <RadarTab model={model} roles={roles} respostas={respostas} activeInfo={activeAss} />
                ) : (
                    <ActionPlanTab model={model} respostas={respostas} activeAss={activeAss} />
                )}
            </main>

            <footer className="py-8 text-center text-slate-700 text-[9px] font-black tracking-[1em] uppercase opacity-40">
                Agilidade e desenvolvimento humano não são destinos, mas jornadas contínuas. Este radar é um guia para sua evolução constante.
            </footer>
            <ImportModal
                isOpen={isImport}
                onClose={() => setIsImport(false)}
                onSelect={(a) => { setRespostas(a.respostas || {}); setActiveAss(a); setIsImport(false); }}
            />
            <HelpModal
                isOpen={helpOpen}
                onClose={() => setHelpOpen(false)}
                currentTab={tab}
            />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);