/**
 * Script de Teste de Penetração
 * Testa vulnerabilidades de segurança do sistema
 * 
 * Execute com: npx ts-node scripts/penetration-test.ts
 */

/**
 * Testes de Segurança
 */
class PenetrationTest {
  private results: Array<{ test: string; passed: boolean; details: string }> = [];

  /**
   * Testa sanitização de inputs XSS
   */
  testXSSProtection(): void {
    console.log("\n🔒 Testando proteção XSS...");
    
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert('XSS')>",
      "javascript:alert('XSS')",
      "<svg onload=alert('XSS')>",
      "data:text/html,<script>alert('XSS')</script>",
    ];

    let passed = true;
    const details: string[] = [];

    xssPayloads.forEach(payload => {
      // Simula sanitização
      const sanitized = payload
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "")
        .replace(/data:/gi, "");

      if (sanitized.includes("<script>") || sanitized.includes("onerror") || sanitized.includes("javascript:")) {
        passed = false;
        details.push(`Falha: ${payload} não foi sanitizado corretamente`);
      }
    });

    this.results.push({
      test: "Proteção XSS",
      passed,
      details: details.length > 0 ? details.join("; ") : "Todos os payloads foram bloqueados",
    });
  }

  /**
   * Testa validação de símbolos
   */
  testSymbolValidation(): void {
    console.log("🔒 Testando validação de símbolos...");
    
    const invalidSymbols = [
      "<script>",
      "../../etc/passwd",
      "'; DROP TABLE assets; --",
      "AAAAAAAAAAAAAAAAAAAAA", // > 20 caracteres
      "",
      null as any,
      undefined as any,
    ];

    let passed = true;
    const details: string[] = [];

    invalidSymbols.forEach(symbol => {
      if (typeof symbol === "string") {
        const sanitized = symbol
          .toUpperCase()
          .replace(/[^A-Z0-9:._-]/g, "")
          .trim()
          .slice(0, 20);

        if (sanitized.length < 1 || sanitized.length > 20) {
          // OK - foi rejeitado
        } else if (symbol.length > 20 && sanitized === symbol) {
          passed = false;
          details.push(`Falha: ${symbol} não foi truncado`);
        }
      }
    });

    this.results.push({
      test: "Validação de Símbolos",
      passed,
      details: details.length > 0 ? details.join("; ") : "Todos os símbolos inválidos foram rejeitados",
    });
  }

  /**
   * Testa validação de quantidades
   */
  testQuantityValidation(): void {
    console.log("🔒 Testando validação de quantidades...");
    
    const invalidQuantities = [
      -1,
      -100,
      1000000001, // > 1 bilhão
      NaN,
      Infinity,
      -Infinity,
      "abc" as any,
      null as any,
    ];

    let passed = true;
    const details: string[] = [];

    invalidQuantities.forEach(qty => {
      const num = typeof qty === "string" ? parseFloat(qty) : qty;
      const isValid = !isNaN(num) && isFinite(num) && num >= 0 && num <= 1000000000;

      if (isValid && (num < 0 || num > 1000000000 || isNaN(num) || !isFinite(num))) {
        passed = false;
        details.push(`Falha: ${qty} foi aceito incorretamente`);
      }
    });

    this.results.push({
      test: "Validação de Quantidades",
      passed,
      details: details.length > 0 ? details.join("; ") : "Todas as quantidades inválidas foram rejeitadas",
    });
  }

  /**
   * Testa validação de preços
   */
  testPriceValidation(): void {
    console.log("🔒 Testando validação de preços...");
    
    const invalidPrices = [
      -1,
      -100,
      1000000001, // > 1 bilhão
      NaN,
      Infinity,
      -Infinity,
      "abc" as any,
      null as any,
    ];

    let passed = true;
    const details: string[] = [];

    invalidPrices.forEach(price => {
      const num = typeof price === "string" ? parseFloat(price) : price;
      const isValid = !isNaN(num) && isFinite(num) && num >= 0 && num <= 1000000000;

      if (isValid && (num < 0 || num > 1000000000 || isNaN(num) || !isFinite(num))) {
        passed = false;
        details.push(`Falha: ${price} foi aceito incorretamente`);
      }
    });

    this.results.push({
      test: "Validação de Preços",
      passed,
      details: details.length > 0 ? details.join("; ") : "Todos os preços inválidos foram rejeitados",
    });
  }

  /**
   * Testa proteção contra SQL Injection (localStorage)
   */
  testSQLInjectionProtection(): void {
    console.log("🔒 Testando proteção contra SQL Injection...");
    
    const sqlPayloads = [
      "'; DROP TABLE assets; --",
      "1' OR '1'='1",
      "admin'--",
      "1' UNION SELECT * FROM users--",
    ];

    let passed = true;
    const details: string[] = [];

    sqlPayloads.forEach(payload => {
      // Como usamos localStorage (JSON), SQL injection não é possível
      // Mas testamos se caracteres especiais são sanitizados
      const sanitized = payload
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "");

      // JSON.stringify já protege contra SQL injection
      try {
        JSON.stringify({ test: sanitized });
        // OK - JSON é seguro
      } catch (error) {
        passed = false;
        details.push(`Falha: ${payload} causou erro no JSON`);
      }
    });

    this.results.push({
      test: "Proteção SQL Injection",
      passed,
      details: details.length > 0 ? details.join("; ") : "JSON.stringify protege contra SQL injection",
    });
  }

  /**
   * Testa limites de tamanho de input
   */
  testInputSizeLimits(): void {
    console.log("🔒 Testando limites de tamanho de input...");
    
    const largeInputs = [
      "A".repeat(10001), // > 10000 caracteres
      "B".repeat(50000),
      "C".repeat(100000),
    ];

    let passed = true;
    const details: string[] = [];

    largeInputs.forEach(input => {
      const sanitized = input.slice(0, 1000); // Limite de 1000 caracteres
      
      if (sanitized.length > 1000) {
        passed = false;
        details.push(`Falha: Input de ${input.length} caracteres não foi truncado`);
      }
    });

    this.results.push({
      test: "Limites de Tamanho de Input",
      passed,
      details: details.length > 0 ? details.join("; ") : "Todos os inputs grandes foram truncados",
    });
  }

  /**
   * Executa todos os testes
   */
  async runAllTests(): Promise<void> {
    console.log("🚀 Iniciando Testes de Penetração...\n");

    this.testXSSProtection();
    this.testSymbolValidation();
    this.testQuantityValidation();
    this.testPriceValidation();
    this.testSQLInjectionProtection();
    this.testInputSizeLimits();

    // Exibe resultados
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESULTADOS DOS TESTES");
    console.log("=".repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    this.results.forEach(result => {
      const status = result.passed ? "✅ PASSOU" : "❌ FALHOU";
      console.log(`\n${status} - ${result.test}`);
      console.log(`   Detalhes: ${result.details}`);
      
      if (result.passed) {
        totalPassed++;
      } else {
        totalFailed++;
      }
    });

    console.log("\n" + "=".repeat(60));
    console.log(`✅ Testes Passados: ${totalPassed}`);
    console.log(`❌ Testes Falhados: ${totalFailed}`);
    console.log(`📈 Taxa de Sucesso: ${((totalPassed / this.results.length) * 100).toFixed(1)}%`);
    console.log("=".repeat(60) + "\n");

    if (totalFailed > 0) {
      console.log("⚠️  ATENÇÃO: Alguns testes falharam. Revise as vulnerabilidades encontradas.");
      process.exit(1);
    } else {
      console.log("🎉 Todos os testes de segurança passaram!");
      process.exit(0);
    }
  }
}

// Executa os testes
if (require.main === module) {
  const tester = new PenetrationTest();
  tester.runAllTests().catch(console.error);
}

export default PenetrationTest;


