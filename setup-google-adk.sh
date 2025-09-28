#!/bin/bash

echo "🤖 Setting up Google ADK (Agent Development Kit) for EsferaZap"
echo "============================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Python 3.10+ is installed
echo -e "${BLUE}Checking Python version...${NC}"
python_version=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+')
if [ $(echo "$python_version >= 3.10" | bc) -eq 1 ]; then
    echo -e "${GREEN}✓ Python $python_version installed${NC}"
else
    echo -e "${YELLOW}⚠ Python 3.10+ required. Please upgrade.${NC}"
    exit 1
fi

# Install Google ADK
echo -e "${BLUE}Installing Google Agent Development Kit...${NC}"
pip install google-genai-agent-development-kit

# Create ADK agent directory
echo -e "${BLUE}Creating ADK agent structure...${NC}"
mkdir -p adk-agents/{customer-service,sales,technical}

# Create base agent configuration
cat > adk-agents/base-config.yaml << 'EOF'
# Google ADK Agent Configuration
name: esferazap-agent
version: 1.0.0
description: WhatsApp Business AI Agent powered by Google ADK

model:
  provider: google
  name: gemini-1.5-flash
  temperature: 0.7
  max_tokens: 1000

capabilities:
  - text_generation
  - conversation
  - function_calling
  - context_retention

integrations:
  whatsapp:
    enabled: true
    api: evolution
  database:
    type: firestore
    project_id: silent-text-458716-c9

safety:
  harm_categories:
    - harassment: BLOCK_MEDIUM_AND_ABOVE
    - hate_speech: BLOCK_MEDIUM_AND_ABOVE
    - sexually_explicit: BLOCK_MEDIUM_AND_ABOVE
    - dangerous_content: BLOCK_MEDIUM_AND_ABOVE
EOF

# Create Customer Service Agent
cat > adk-agents/customer-service/agent.py << 'EOF'
"""Customer Service Agent using Google ADK"""

from google.genai.agent import Agent, Tool
from google.genai.types import GenerateContentConfig
import asyncio
from typing import Dict, Any

class CustomerServiceAgent(Agent):
    def __init__(self):
        super().__init__(
            name="customer-service",
            description="Atende clientes via WhatsApp com IA avançada",
            model="gemini-1.5-flash"
        )

        # Configure tools
        self.add_tool(Tool(
            name="check_order",
            description="Verifica status de pedido",
            function=self.check_order_status
        ))

        self.add_tool(Tool(
            name="schedule_appointment",
            description="Agenda atendimento",
            function=self.schedule_appointment
        ))

    async def check_order_status(self, order_id: str) -> Dict[str, Any]:
        """Check order status in database"""
        # Integration with your database
        return {
            "order_id": order_id,
            "status": "processing",
            "estimated_delivery": "2-3 dias úteis"
        }

    async def schedule_appointment(self, date: str, time: str) -> Dict[str, Any]:
        """Schedule customer appointment"""
        return {
            "scheduled": True,
            "date": date,
            "time": time,
            "confirmation_code": "APT-2024-001"
        }

    async def process_message(self, message: str, context: Dict = None) -> str:
        """Process incoming WhatsApp message"""
        config = GenerateContentConfig(
            temperature=0.7,
            top_p=0.95,
            max_output_tokens=500
        )

        # Add context if available
        prompt = f"""
        Você é um assistente de atendimento ao cliente profissional e amigável.

        Contexto do cliente: {context if context else 'Novo cliente'}
        Mensagem do cliente: {message}

        Responda de forma clara, útil e empática.
        """

        response = await self.generate_content(prompt, config)
        return response.text

# Initialize agent
agent = CustomerServiceAgent()

async def handle_whatsapp_message(phone: str, message: str) -> str:
    """Handle incoming WhatsApp messages"""
    # Get customer context from database
    context = {"phone": phone, "history": []}

    # Process with ADK agent
    response = await agent.process_message(message, context)

    return response

if __name__ == "__main__":
    # Test the agent
    async def test():
        response = await handle_whatsapp_message(
            "+5511999999999",
            "Olá, qual o status do meu pedido #12345?"
        )
        print(f"Agent response: {response}")

    asyncio.run(test())
EOF

# Create Sales Agent
cat > adk-agents/sales/agent.py << 'EOF'
"""Sales Agent using Google ADK"""

from google.genai.agent import Agent, Tool
from google.genai.types import GenerateContentConfig
import asyncio

class SalesAgent(Agent):
    def __init__(self):
        super().__init__(
            name="sales",
            description="Agente de vendas inteligente para WhatsApp",
            model="gemini-1.5-pro"
        )

        self.system_prompt = """
        Você é um vendedor consultivo especializado em identificar necessidades
        e oferecer soluções personalizadas. Seja persuasivo mas não insistente.
        Foque em construir relacionamento e entender as dores do cliente.
        """

    async def qualify_lead(self, message: str) -> dict:
        """Qualify lead based on conversation"""
        prompt = f"""
        Analise a mensagem e classifique o lead:
        Mensagem: {message}

        Retorne:
        - interesse_nivel: (alto/medio/baixo)
        - produto_interesse: (produto identificado)
        - proxima_acao: (sugestão de próximo passo)
        """

        response = await self.generate_content(prompt)
        return {"analysis": response.text}

    async def generate_pitch(self, product: str, customer_profile: dict) -> str:
        """Generate personalized sales pitch"""
        prompt = f"""
        Crie um pitch de vendas personalizado:
        Produto: {product}
        Perfil do cliente: {customer_profile}

        O pitch deve ser:
        - Personalizado
        - Focado em benefícios
        - Com call-to-action claro
        - Máximo 3 parágrafos
        """

        response = await self.generate_content(prompt)
        return response.text
EOF

# Create Technical Support Agent
cat > adk-agents/technical/agent.py << 'EOF'
"""Technical Support Agent using Google ADK"""

from google.genai.agent import Agent, Tool
import asyncio

class TechnicalSupportAgent(Agent):
    def __init__(self):
        super().__init__(
            name="technical-support",
            description="Suporte técnico inteligente via WhatsApp",
            model="gemini-1.5-flash"
        )

        self.knowledge_base = {
            "reset_password": "Para resetar senha: 1) Acesse o app, 2) Clique em 'Esqueci senha'...",
            "connection_issues": "Verifique: 1) Conexão internet, 2) Reinicie o app...",
            "update_app": "Atualize o app na loja: Play Store ou App Store..."
        }

    async def diagnose_issue(self, problem_description: str) -> dict:
        """Diagnose technical issue using AI"""
        prompt = f"""
        Analise o problema técnico relatado e forneça:

        Problema: {problem_description}

        1. Diagnóstico provável
        2. Passos de solução (numerados)
        3. Se precisa escalar para humano (sim/não)

        Seja claro e técnico mas acessível.
        """

        response = await self.generate_content(prompt)
        return {
            "diagnosis": response.text,
            "requires_escalation": "escalar" in response.text.lower()
        }
EOF

# Create integration file
cat > adk-agents/integration.ts << 'EOF'
/**
 * Google ADK Integration for EsferaZap
 */

import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export class GoogleADKIntegration extends EventEmitter {
  private pythonProcess: any;
  private agentType: string;

  constructor(agentType: 'customer-service' | 'sales' | 'technical') {
    super();
    this.agentType = agentType;
  }

  async initialize() {
    console.log(`Initializing Google ADK ${this.agentType} agent...`);

    // Start Python ADK agent process
    this.pythonProcess = spawn('python3', [
      `adk-agents/${this.agentType}/agent.py`
    ]);

    this.pythonProcess.stdout.on('data', (data: Buffer) => {
      const response = data.toString();
      this.emit('response', response);
    });

    this.pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error('ADK Error:', data.toString());
    });
  }

  async processMessage(phone: string, message: string): Promise<string> {
    // Send message to Python ADK agent
    const input = JSON.stringify({ phone, message });
    this.pythonProcess.stdin.write(input + '\n');

    // Wait for response
    return new Promise((resolve) => {
      this.once('response', (response) => {
        resolve(response);
      });
    });
  }

  destroy() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
    }
  }
}

// Example usage in your WhatsApp handler
export async function handleWhatsAppMessage(phone: string, message: string) {
  const adk = new GoogleADKIntegration('customer-service');
  await adk.initialize();

  try {
    const response = await adk.processMessage(phone, message);
    console.log('ADK Response:', response);

    // Send response back via WhatsApp
    return response;
  } finally {
    adk.destroy();
  }
}
EOF

# Create test script
cat > adk-agents/test-adk.js << 'EOF'
/**
 * Test Google ADK Integration
 */

const { GoogleADKIntegration } = require('./integration');

async function test() {
  console.log('🧪 Testing Google ADK Integration...\n');

  const testCases = [
    {
      agent: 'customer-service',
      message: 'Qual o status do meu pedido #12345?'
    },
    {
      agent: 'sales',
      message: 'Quero saber mais sobre o plano premium'
    },
    {
      agent: 'technical',
      message: 'Meu app não está abrindo, o que fazer?'
    }
  ];

  for (const test of testCases) {
    console.log(`\n📱 Testing ${test.agent} agent:`);
    console.log(`Message: "${test.message}"`);

    const adk = new GoogleADKIntegration(test.agent);
    await adk.initialize();

    try {
      const response = await adk.processMessage('+5511999999999', test.message);
      console.log(`Response: ${response}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    } finally {
      adk.destroy();
    }
  }
}

// Run tests
test().catch(console.error);
EOF

# Install Python dependencies
echo -e "${BLUE}Installing Python dependencies for ADK...${NC}"
cat > adk-agents/requirements.txt << 'EOF'
google-generativeai>=0.3.0
google-cloud-aiplatform>=1.38.0
google-genai-agent-development-kit>=0.1.0
aiohttp>=3.9.0
pydantic>=2.0.0
python-dotenv>=1.0.0
EOF

pip install -r adk-agents/requirements.txt

# Create .env template
cat > adk-agents/.env.template << 'EOF'
# Google ADK Configuration
GOOGLE_API_KEY=your-gemini-api-key-here
GOOGLE_PROJECT_ID=silent-text-458716-c9
GOOGLE_LOCATION=us-central1

# Model Settings
MODEL_NAME=gemini-1.5-flash
TEMPERATURE=0.7
MAX_TOKENS=1000

# WhatsApp Integration
WHATSAPP_API_URL=http://localhost:8000
WHATSAPP_API_TOKEN=your-token
EOF

echo -e "${GREEN}✅ Google ADK setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy adk-agents/.env.template to adk-agents/.env"
echo "2. Add your Google API key for Gemini"
echo "3. Test with: node adk-agents/test-adk.js"
echo "4. Integrate with your WhatsApp backend"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "- Google ADK: https://ai.google.dev/adk"
echo "- Gemini API: https://ai.google.dev/gemini-api"
echo "- Integration Guide: adk-agents/README.md"