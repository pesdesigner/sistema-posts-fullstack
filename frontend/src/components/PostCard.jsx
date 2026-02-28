import toast from 'react-hot-toast';

export function PostCard({ post, showActions, onEdit, onDelete, showAuthor = true }) {
    return (
        <div className="glass-card relative group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-500/30 text-blue-200 text-[10px] font-bold px-2 py-1 rounded uppercase border border-blue-400/30">
                    {post.tecnologia}
                </span>

                {/* SÓ MOSTRA O AUTOR SE showAuthor FOR TRUE */}
                {showAuthor && (
                    <span className="text-white/40 text-[11px] italic">
                        por {post.nomeAutor || "Autor Desconhecido"}
                    </span>
                )}
          

            {/* Ações (Editar/Excluir) só aparecem se showActions for true */}
            {showActions && (
                <div className="flex gap-3">
                    <button onClick={() => onEdit(post.id)} className="text-blue-400 hover:text-blue-200 text-xs font-bold">EDITAR</button>
                    <button onClick={() => onDelete(post.id)} className="text-red-400 hover:text-red-200 text-xs font-bold">EXCLUIR</button>
                </div>
            )}
            </div>

            <h2 className="text-xl font-bold text-white mb-3">{post.titulo}</h2>
            <p className="text-white/60 text-sm mb-6 flex-grow">{post.descricao}</p>

            <div className={`relative rounded-lg p-4 font-mono text-sm border custom-scrollbar ${post.comando.includes('\n')
                    ? 'bg-slate-900/90 text-blue-300 border-blue-500/30 code-block'
                    : 'bg-black/40 text-green-400 border-white/10 flex justify-between items-center'
                }`}>
                <code className="block pr-8">
                    {post.comando.includes('\n') ? post.comando : `$ ${post.comando}`}
                </code>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(post.comando);
                        toast.success("Copiado para a área de transferência!");
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/80 p-2 rounded text-white"
                >📋</button>
            </div>
        </div>
    );
}
