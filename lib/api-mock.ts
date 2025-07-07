import { OrderItem } from "@/contexts/PedidoContext";

export interface Mesa {
  id: number;
  nome: string;
  status: 'livre' | 'ocupada' | 'atencao';
}

export interface Categoria {
  id: number;
  nome: string;
  imagemUrl: string;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoriaId: number;
  isPopular: boolean;
  imagemUrl?: string;
  descricaoBreve: string;
  ingredientes: string[];
}

export interface PedidoSalvo {
  id: number;
  mesaId: string;
  mesaNome: string;
  status: 'aberto' | 'entregue';
  dataHora: Date;
  itens: OrderItem[];
  valorTotal: number;
  observacoes?: string;
}


// Simula latencia rede
const delay = (ms: number) => new Promise(res => setTimeout(res, 1));

export async function fetchMesas(): Promise<Mesa[]> {
  await delay(500);
  return [
    { id: 1, nome: "1", status: 'atencao' }, { id: 2, nome: "2", status: 'livre' }, { id: 3, nome: "3", status: 'atencao' },
    { id: 4, nome: "4", status: 'livre' }, { id: 5, nome: "5", status: 'livre' }, { id: 6, nome: "6", status: 'livre' },
    { id: 7, nome: "7", status: 'livre' }, { id: 8, nome: "8", status: 'ocupada' }, { id: 9, nome: "9", status: 'livre' },
    { id: 10, nome: "10", status: 'ocupada' }, { id: 11, nome: "11", status: 'livre' }, { id: 12, nome: "12", status: 'livre' },
    { id: 13, nome: "13", status: 'livre' }, { id: 14, nome: "14", status: 'livre' }, { id: 15, nome: "15", status: 'livre' },
    { id: 16, nome: "16", status: 'atencao' }, { id: 17, nome: "17", status: 'livre' }, { id: 18, nome: "18", status: 'livre' },
  ];
}

export async function fetchCategorias(): Promise<Categoria[]> {
  await delay(500);
  return [
    { id: 1, nome: "Barcas", imagemUrl: "/images/categories/category-barcas.jpg" },
    { id: 2, nome: "Bebidas", imagemUrl: "/images/categories/category-bebidas.jpg" },
    { id: 3, nome: "Pratos Quentes", imagemUrl: "/images/categories/category-pratos-quentes.jpg" },
    { id: 4, nome: "Sushi", imagemUrl: "/images/categories/category-sushi.jpg" },
  ];
}

let pedidosSalvos: PedidoSalvo[] = [
  {
    id: 1,
    mesaId: '8',
    mesaNome: 'Mesa 08',
    status: 'aberto',
    dataHora: new Date('2025-06-23T20:30:00'),
    itens: [
      { id: 401, nome: "Uramaki Filadélfia (8 un)", preco: 32.00, categoriaId: 4, isPopular: true, descricaoBreve: "", ingredientes: [], quantity: 2 },
      { id: 201, nome: "Coca-Cola Lata", preco: 7.00, categoriaId: 2, isPopular: true, descricaoBreve: "", ingredientes: [], quantity: 4 },
    ],
    valorTotal: 92.00,
    observacoes: 'Uma coca-cola sem gelo, por favor.'
  },
  {
    id: 2,
    mesaId: '10',
    mesaNome: 'Balcão',
    status: 'aberto',
    dataHora: new Date('2025-06-23T20:00:00'),
    itens: [
      { id: 301, nome: "Yakisoba de Carne", preco: 45.00, categoriaId: 3, isPopular: true, descricaoBreve: "", ingredientes: [], quantity: 1 },
    ],
    valorTotal: 45.00,
  },
  {
    id: 3,
    mesaId: '3',
    mesaNome: 'Mesa 03',
    status: 'entregue',
    dataHora: new Date('2025-06-23T19:00:00'),
    itens: [
      { id: 101, nome: "Barca Miyako (2 Pessoas)", preco: 120.00, categoriaId: 1, isPopular: true, descricaoBreve: "", ingredientes: [], quantity: 1 },
      { id: 202, nome: "Cerveja Sapporo", preco: 25.00, categoriaId: 2, isPopular: false, descricaoBreve: "", ingredientes: [], quantity: 2 },
    ],
    valorTotal: 170.00,
  },
];



export async function fetchProdutos(): Promise<Produto[]> {
  await delay(800);
   return [
    { 
      id: 101, nome: "Barca Miyako (2 Pessoas)", preco: 120.00, categoriaId: 1, isPopular: true, 
      imagemUrl: "/images/products/barca-miyako.png",
      descricaoBreve: "Uma seleção especial do chef com 40 peças variadas.",
      ingredientes: ["Sashimi de salmão e atum", "Niguiri", "Uramaki", "Hossomaki", "Joy"]
    },
    { 
      id: 102, nome: "Barca Salmão (1 Pessoa)", preco: 75.00, categoriaId: 1, isPopular: false, 
      imagemUrl: "https://placehold.co/400x400",
      descricaoBreve: "25 peças dedicadas aos amantes de salmão.",
      ingredientes: ["Sashimi de salmão", "Niguiri de salmão", "Uramaki Filadélfia", "Joy de salmão"]
    },
    
    {
      id: 201, nome: "Coca-Cola Lata", preco: 7.00, categoriaId: 2, isPopular: true,
      imagemUrl: "/images/products/coca-lata.png",
      descricaoBreve: "Lata de 350ml gelada.",
      ingredientes: ["Refrigerante de cola"]
    },
    {
      id: 202, nome: "Cerveja Sapporo", preco: 25.00, categoriaId: 2, isPopular: false,
      imagemUrl: "https://placehold.co/400x400",
      descricaoBreve: "Lager premium japonesa, lata de 650ml.",
      ingredientes: ["Cerveja de malte e lúpulo"]
    },
    {
      id: 203, nome: "Saquê Dose", preco: 18.00, categoriaId: 2, isPopular: false,
      imagemUrl: "https://placehold.co/400x400",
      descricaoBreve: "Dose de saquê nacional de alta qualidade.",
      ingredientes: ["Arroz fermentado"]
    },

    {
      id: 301, nome: "Yakisoba de Carne", preco: 45.00, categoriaId: 3, isPopular: true,
      imagemUrl: "/images/products/yakisoba-carne.jpg",
      descricaoBreve: "Macarrão frito com pedaços de carne e legumes frescos.",
      ingredientes: ["Macarrão para yakisoba", "Carne", "Brócolis", "Cenoura", "Couve-flor", "Molho shoyu"]
    },
    {
      id: 302, nome: "Tempurá de Camarão", preco: 55.00, categoriaId: 3, isPopular: false,
      imagemUrl: "https://placehold.co/400x400",
      descricaoBreve: "8 unidades de camarões grandes empanados e fritos.",
      ingredientes: ["Camarão", "Farinha de tempurá", "Molho especial"]
    },

    {
      id: 401, nome: "Uramaki Filadélfia (8 un)", preco: 32.00, categoriaId: 4, isPopular: true,
      imagemUrl: "/images/products/urumaki-filadelfia.jpg",
      descricaoBreve: "Enrolado de arroz com alga por dentro, salmão e cream cheese.",
      ingredientes: ["Arroz de sushi", "Salmão", "Cream cheese", "Gergelim"]
    },
    {
      id: 402, nome: "Sashimi de Atum (5 fatias)", preco: 28.00, categoriaId: 4, isPopular: false,
      imagemUrl: "https://placehold.co/400x400",
      descricaoBreve: "Fatias grossas de atum fresco.",
      ingredientes: ["Atum"]
    },
    {
      id: 403, nome: "Niguiri de Polvo (2 un)", preco: 22.00, categoriaId: 4, isPopular: false,
      imagemUrl: "https://placehold.co/400x400",
      descricaoBreve: "Bolinho de arroz coberto com uma fatia de polvo cozido.",
      ingredientes: ["Arroz de sushi", "Polvo"]
    }
  ];
}


export async function searchProducts(searchTerm: string): Promise<Produto[]> {
  if (!searchTerm.trim()) {
    return [];
  }

  await delay(500);
  console.log(`API MOCK: Buscando por "${searchTerm}"...`);

  const allProducts = await fetchProdutos();

  const lowercasedTerm = searchTerm.toLowerCase();

  const results = allProducts.filter(product =>
    product.nome.toLowerCase().includes(lowercasedTerm)
  );

  return results;
}

export async function fetchPedidos(): Promise<PedidoSalvo[]> {
  await delay(700);
  console.log("API MOCK: Buscando todos os pedidos salvos...");
  return pedidosSalvos.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
}


export async function saveNewOrder(orderData: Omit<PedidoSalvo, 'id' | 'dataHora' | 'status' | 'mesaNome'>): Promise<PedidoSalvo> {
  await delay(300);
  console.log("API MOCK: Salvando novo pedido...");
  const mesas = await fetchMesas();
  const mesaInfo = mesas.find(m => m.id.toString() === orderData.mesaId);

  const maxId = pedidosSalvos.reduce((max, p) => p.id > max ? p.id : max, 0);
  const newId = maxId + 1;

  const newOrder: PedidoSalvo = {
    ...orderData,
    id: newId,
    dataHora: new Date(),
    status: 'aberto',
    mesaNome: mesaInfo?.nome || 'Mesa Desconhecida'
  };

  pedidosSalvos.unshift(newOrder);
  return newOrder;
}


export async function finalizarPedido(pedidoId: number): Promise<{success: boolean}> { // ALTERADO
  await delay(500);
  console.log(`API MOCK: Finalizando pedido ${pedidoId}...`);
  const pedidoIndex = pedidosSalvos.findIndex(p => p.id === pedidoId); // ALTERADO

  if (pedidoIndex === -1) {
    console.error("API MOCK: Pedido não encontrado para finalizar.");
    return { success: false };
  }

  pedidosSalvos[pedidoIndex].status = 'entregue';
  return { success: true };
}

export async function fetchPedidoById(id: number): Promise<PedidoSalvo | undefined> {
  await delay(80);
  console.log(pedidosSalvos);
  console.log(`API MOCK: Buscando pedido com ID ${id}...`);
  return pedidosSalvos.find(p => p.id === id);
}
