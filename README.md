# Trace Explore Verify

Build a complete, professional, desktop-first web application called TRACE QA, an Autonomous AI QA Testing Platform.

This is an actual application dashboard, NOT a marketing website or landing page.

The attached screenshot is the visual reference for the design language. Follow its pure-black OLED appearance and electric-green accents (#39FF14), but create an original interface specifically for autonomous software testing.

Core principle:
AI PLANS. PLAYWRIGHT EXECUTES. ASSERTIONS VERIFY. EVIDENCE PROVES.

Follow the complete specification in the attached markdown document:
- Visual design: Pure black OLED (#000000, secondary #080B0E, elevated #0D1117, borders #25313C, primary accent #39FF14, primary text #FFFFFF, secondary text #8A9BAD, failure #FF5555, warning #FFBD4A). Compact professional typography, thin subtle borders, restrained green glow.
- Global application shell: Collapsible left sidebar with electric-green active indicator, top bar with workspace, active project selector, notifications, profile, and system status indicator.
- Navigation screens:
  1. Overview: Operations console with quick test launch (URL, objective, browser, depth, categories, Start Exploration), live Agent Activity timeline/progress, Website Workflow journey nodes, compact execution metrics, recent executions table, and latest findings.
  2. Projects: Project management table with Create Project modal, environments, test coverage, and history.
  3. Exploration: 3-panel technical workspace (Left: Website structure/routes hierarchy, Center: Interactive connected workflow graph/nodes, Right: Discovered Element Inspector with selectors & attributes), plus discovery summary and re-explore action.
  4. Test Cases: Structured test design workspace with category filters, priority tags, multi-select execution, and interactive drawer showing preconditions, ordered browser steps, and assertions.
  5. Executions: Split-screen live browser operations (Left: browser viewport placeholder & interactions, Right: technical execution console with timestamped logs, steps, assertions, errors), top status bar with controls.
  6. Results: Test analysis with failed assertion inspector (expected vs. actual), duration, and links to bug reports/evidence.
  7. Bug Reports: Engineering issue investigation workspace with severity badges, repro steps, failed assertions, and screenshots.
  8. Evidence: Evidence library with screenshots gallery, logs, full-size modal preview, and downloads.
  9. Settings: AI model provider, API key inputs, browser configuration, timeouts, and workspace settings.
- Fully working local interactive mock state across all views (switching projects, starting exploration, selecting nodes to view elements, expanding test drawers, toggling execution logs, filtering bugs, and previewing evidence).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/982d7690-0981-490d-840b-864974bbdeca).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
