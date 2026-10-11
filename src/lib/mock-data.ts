// MOCK DATA — frontend prototype only. Replace with FastAPI endpoints later.
export type Status = "passed" | "failed" | "running" | "queued" | "skipped";
export type Severity = "critical" | "high" | "medium" | "low";
export type Priority = "P0" | "P1" | "P2" | "P3";

export interface Project {
  id: string;
  name: string;
  url: string;
  environments: string[];
  coverage: number;
  tests: number;
  lastRun: string;
  passRate: number;
  history: Status[];
}

export const projects: Project[] = [
  { id: "p1", name: "Northwind Storefront", url: "https://shop.northwind.dev", environments: ["staging", "production"], coverage: 78, tests: 142, lastRun: "12 min ago", passRate: 91, history: ["passed","passed","failed","passed","passed","failed","passed","passed"] },
  { id: "p2", name: "Ledgerly Billing Portal", url: "https://app.ledgerly.io", environments: ["dev", "staging"], coverage: 64, tests: 88, lastRun: "2 h ago", passRate: 84, history: ["failed","passed","passed","passed","failed","failed","passed","passed"] },
  { id: "p3", name: "Atlas Docs", url: "https://docs.atlas.sh", environments: ["production"], coverage: 92, tests: 51, lastRun: "yesterday", passRate: 98, history: ["passed","passed","passed","passed","passed","passed","passed","passed"] },
];

export interface FlowNode { id: string; label: string; route: string; x: number; y: number; kind: "page" | "form" | "modal" | "terminal"; elements: Element[]; }
export interface Element { id: string; tag: string; label: string; selector: string; role: string; attrs: Record<string, string>; }

const el = (id: string, tag: string, label: string, selector: string, role: string, attrs: Record<string, string> = {}): Element => ({ id, tag, label, selector, role, attrs });

export const flowNodes: FlowNode[] = [
  { id: "home", label: "Home", route: "/", x: 60, y: 160, kind: "page", elements: [el("e1","a","Shop now","[data-testid=hero-cta]","link",{href:"/products"}), el("e2","input","Search","input[name=q]","searchbox",{type:"search",placeholder:"Search products"}), el("e3","button","Sign in","header >> text=Sign in","button")] },
  { id: "login", label: "Login", route: "/login", x: 260, y: 50, kind: "form", elements: [el("e4","input","Email","#email","textbox",{type:"email",required:"true"}), el("e5","input","Password","#password","textbox",{type:"password",required:"true"}), el("e6","button","Submit","button[type=submit]","button",{disabled:"false"})] },
  { id: "catalog", label: "Catalog", route: "/products", x: 260, y: 260, kind: "page", elements: [el("e7","select","Sort by","select#sort","combobox",{options:"4"}), el("e8","a","Product card","[data-testid=product-card] >> nth=0","link"), el("e9","button","Load more","text=Load more","button")] },
  { id: "pdp", label: "Product detail", route: "/products/:id", x: 470, y: 260, kind: "page", elements: [el("e10","button","Add to cart","[data-testid=add-to-cart]","button"), el("e11","select","Size","select[name=size]","combobox",{required:"true"}), el("e12","input","Quantity","input[name=qty]","spinbutton",{min:"1",max:"10"})] },
  { id: "cart", label: "Cart drawer", route: "/cart", x: 670, y: 160, kind: "modal", elements: [el("e13","button","Checkout","[data-testid=checkout]","button"), el("e14","button","Remove item","[aria-label='Remove item']","button"), el("e15","input","Promo code","input#promo","textbox")] },
  { id: "checkout", label: "Checkout", route: "/checkout", x: 870, y: 160, kind: "form", elements: [el("e16","input","Card number","iframe >> input[name=cardnumber]","textbox",{autocomplete:"cc-number"}), el("e17","input","Postal code","#postal","textbox",{pattern:"[0-9]{5}"}), el("e18","button","Pay","button:has-text('Pay')","button")] },
  { id: "confirm", label: "Order confirmed", route: "/order/:id", x: 1060, y: 160, kind: "terminal", elements: [el("e19","h1","Thank you","h1","heading"), el("e20","span","Order ID","[data-testid=order-id]","text")] },
];
export const flowEdges: [string, string][] = [["home","login"],["home","catalog"],["catalog","pdp"],["login","catalog"],["pdp","cart"],["cart","checkout"],["checkout","confirm"]];

export interface Step { action: string; target: string; value?: string; }
export interface Assertion { type: string; expected: string; actual?: string; ok?: boolean; }
export interface TestCase { id: string; title: string; category: string; priority: Priority; status: Status; duration: string; flow: string; preconditions: string[]; steps: Step[]; assertions: Assertion[]; }

export const categories = ["Functional", "Authentication", "Forms", "Navigation", "Accessibility", "Performance"];

export const testCases: TestCase[] = [
  { id: "TC-101", title: "Guest completes checkout with valid card", category: "Functional", priority: "P0", status: "failed", duration: "14.2s", flow: "Home → Catalog → PDP → Cart → Checkout",
    preconditions: ["Cart is empty", "Stripe test mode enabled", "Viewport 1440×900"],
    steps: [{action:"goto",target:"/"},{action:"click",target:"[data-testid=hero-cta]"},{action:"click",target:"[data-testid=product-card] >> nth=0"},{action:"select",target:"select[name=size]",value:"M"},{action:"click",target:"[data-testid=add-to-cart]"},{action:"click",target:"[data-testid=checkout]"},{action:"fill",target:"#postal",value:"94107"},{action:"click",target:"button:has-text('Pay')"}],
    assertions: [{type:"toHaveURL",expected:"/order/*",actual:"/checkout",ok:false},{type:"toBeVisible",expected:"[data-testid=order-id]",actual:"not found",ok:false},{type:"toHaveCount",expected:"cart badge = 0",actual:"1",ok:false}] },
  { id: "TC-102", title: "Login rejects invalid password", category: "Authentication", priority: "P0", status: "passed", duration: "3.1s", flow: "Home → Login",
    preconditions: ["User qa@northwind.dev exists"], steps: [{action:"goto",target:"/login"},{action:"fill",target:"#email",value:"qa@northwind.dev"},{action:"fill",target:"#password",value:"wrong-pass"},{action:"click",target:"button[type=submit]"}],
    assertions: [{type:"toHaveText",expected:"Invalid credentials",actual:"Invalid credentials",ok:true},{type:"toHaveURL",expected:"/login",actual:"/login",ok:true}] },
  { id: "TC-103", title: "Search returns relevant products", category: "Functional", priority: "P1", status: "passed", duration: "4.8s", flow: "Home → Catalog",
    preconditions: ["Catalog seeded"], steps: [{action:"goto",target:"/"},{action:"fill",target:"input[name=q]",value:"jacket"},{action:"press",target:"input[name=q]",value:"Enter"}],
    assertions: [{type:"toHaveCount",expected:"> 0 product cards",actual:"12",ok:true}] },
  { id: "TC-104", title: "Postal code field validates format", category: "Forms", priority: "P1", status: "failed", duration: "5.6s", flow: "Cart → Checkout",
    preconditions: ["Cart contains 1 item"], steps: [{action:"goto",target:"/checkout"},{action:"fill",target:"#postal",value:"ABCDE"},{action:"click",target:"button:has-text('Pay')"}],
    assertions: [{type:"toHaveAttribute",expected:"aria-invalid=true",actual:"aria-invalid=false",ok:false},{type:"toBeVisible",expected:"Invalid postal code",actual:"hidden",ok:false}] },
  { id: "TC-105", title: "Primary nav links resolve without 404", category: "Navigation", priority: "P2", status: "passed", duration: "8.9s", flow: "Home",
    preconditions: [], steps: [{action:"goto",target:"/"},{action:"crawl",target:"nav a"}], assertions: [{type:"status",expected:"200 for 9 links",actual:"200 for 9 links",ok:true}] },
  { id: "TC-106", title: "Add-to-cart button has accessible name", category: "Accessibility", priority: "P2", status: "queued", duration: "—", flow: "PDP",
    preconditions: [], steps: [{action:"goto",target:"/products/42"}], assertions: [{type:"toHaveAccessibleName",expected:"Add to cart"}] },
  { id: "TC-107", title: "Catalog LCP under 2.5s", category: "Performance", priority: "P3", status: "skipped", duration: "—", flow: "Catalog",
    preconditions: ["Throttling: Fast 3G"], steps: [{action:"goto",target:"/products"}], assertions: [{type:"metric",expected:"LCP < 2500ms"}] },
  { id: "TC-108", title: "Session persists after reload", category: "Authentication", priority: "P1", status: "passed", duration: "2.7s", flow: "Login → Catalog",
    preconditions: ["Logged in"], steps: [{action:"reload",target:"page"}], assertions: [{type:"toBeVisible",expected:"Account menu",actual:"visible",ok:true}] },
];

export interface Execution { id: string; project: string; suite: string; status: Status; passed: number; failed: number; duration: string; browser: string; started: string; }
export const executions: Execution[] = [
  { id: "RUN-2048", project: "Northwind Storefront", suite: "Checkout regression", status: "failed", passed: 38, failed: 3, duration: "4m 12s", browser: "Chromium", started: "12 min ago" },
  { id: "RUN-2047", project: "Ledgerly Billing Portal", suite: "Smoke", status: "passed", passed: 22, failed: 0, duration: "1m 48s", browser: "Firefox", started: "2 h ago" },
  { id: "RUN-2046", project: "Northwind Storefront", suite: "Auth flows", status: "passed", passed: 14, failed: 0, duration: "58s", browser: "WebKit", started: "5 h ago" },
  { id: "RUN-2045", project: "Atlas Docs", suite: "Full exploration", status: "passed", passed: 51, failed: 0, duration: "6m 03s", browser: "Chromium", started: "yesterday" },
  { id: "RUN-2044", project: "Ledgerly Billing Portal", suite: "Invoices", status: "failed", passed: 17, failed: 2, duration: "2m 31s", browser: "Chromium", started: "yesterday" },
];

export interface Bug { id: string; title: string; severity: Severity; status: "open" | "triaged" | "resolved"; test: string; route: string; found: string; summary: string; repro: string[]; evidence: string[]; }
export const bugs: Bug[] = [
  { id: "BUG-311", title: "Payment succeeds but redirect to order page never fires", severity: "critical", status: "open", test: "TC-101", route: "/checkout", found: "12 min ago", summary: "After Stripe returns 200, the client stays on /checkout. Network shows POST /api/orders 201 but router.push is never called.", repro: ["Add any product to cart","Proceed to checkout","Enter postal 94107 and test card 4242…","Click Pay"], evidence: ["ev1","ev2","ev5"] },
  { id: "BUG-310", title: "Postal code accepts alphabetic input", severity: "high", status: "triaged", test: "TC-104", route: "/checkout", found: "12 min ago", summary: "The pattern attribute exists but form uses noValidate and no JS validation is applied.", repro: ["Open /checkout","Type ABCDE in postal code","Click Pay"], evidence: ["ev3"] },
  { id: "BUG-309", title: "Cart badge count not reset after order", severity: "medium", status: "open", test: "TC-101", route: "/order/:id", found: "12 min ago", summary: "Cart badge shows 1 after successful order in prior run.", repro: ["Complete a purchase","Observe header badge"], evidence: ["ev2"] },
  { id: "BUG-305", title: "Invoice PDF download times out on Firefox", severity: "low", status: "resolved", test: "TC-212", route: "/invoices/:id", found: "yesterday", summary: "Download event exceeded 30s timeout in Firefox only.", repro: ["Open any invoice","Click Download PDF"], evidence: ["ev4"] },
];

export interface Evidence { id: string; kind: "screenshot" | "log" | "trace" | "video"; name: string; test: string; run: string; size: string; when: string; }
export const evidence: Evidence[] = [
  { id: "ev1", kind: "screenshot", name: "checkout-after-pay.png", test: "TC-101", run: "RUN-2048", size: "412 KB", when: "12 min ago" },
  { id: "ev2", kind: "screenshot", name: "header-cart-badge.png", test: "TC-101", run: "RUN-2048", size: "188 KB", when: "12 min ago" },
  { id: "ev3", kind: "screenshot", name: "postal-invalid-accepted.png", test: "TC-104", run: "RUN-2048", size: "240 KB", when: "12 min ago" },
  { id: "ev4", kind: "log", name: "firefox-download.log", test: "TC-212", run: "RUN-2044", size: "14 KB", when: "yesterday" },
  { id: "ev5", kind: "trace", name: "trace-TC-101.zip", test: "TC-101", run: "RUN-2048", size: "3.2 MB", when: "12 min ago" },
  { id: "ev6", kind: "screenshot", name: "login-error-state.png", test: "TC-102", run: "RUN-2048", size: "156 KB", when: "12 min ago" },
  { id: "ev7", kind: "video", name: "checkout-run.webm", test: "TC-101", run: "RUN-2048", size: "8.9 MB", when: "12 min ago" },
  { id: "ev8", kind: "screenshot", name: "catalog-search-jacket.png", test: "TC-103", run: "RUN-2048", size: "302 KB", when: "12 min ago" },
];

export const agentPhases = ["Planning", "Crawling routes", "Mapping elements", "Building workflows", "Generating tests", "Executing", "Verifying"];

export const executionScript: { t: string; level: "info" | "step" | "pass" | "fail" | "warn"; msg: string }[] = [
  { t: "00:00.012", level: "info", msg: "Launching chromium 124 (headless=false) viewport 1440×900" },
  { t: "00:00.640", level: "step", msg: "page.goto('https://shop.northwind.dev/')" },
  { t: "00:01.402", level: "pass", msg: "expect(page).toHaveTitle(/Northwind/) ✓" },
  { t: "00:01.980", level: "step", msg: "click [data-testid=hero-cta]" },
  { t: "00:02.611", level: "step", msg: "click [data-testid=product-card] >> nth=0" },
  { t: "00:03.204", level: "step", msg: "selectOption select[name=size] 'M'" },
  { t: "00:03.700", level: "step", msg: "click [data-testid=add-to-cart]" },
  { t: "00:04.115", level: "pass", msg: "expect(cartBadge).toHaveText('1') ✓" },
  { t: "00:04.890", level: "step", msg: "click [data-testid=checkout]" },
  { t: "00:06.022", level: "step", msg: "fill #postal '94107'" },
  { t: "00:06.540", level: "step", msg: "click button:has-text('Pay')" },
  { t: "00:08.210", level: "info", msg: "network POST /api/orders → 201 (312ms)" },
  { t: "00:13.215", level: "fail", msg: "expect(page).toHaveURL('/order/*') ✗ received '/checkout' (timeout 5000ms)" },
  { t: "00:13.300", level: "warn", msg: "screenshot saved → checkout-after-pay.png" },
  { t: "00:14.201", level: "fail", msg: "Test TC-101 failed · 2 assertions failed · bug BUG-311 drafted" },
];
