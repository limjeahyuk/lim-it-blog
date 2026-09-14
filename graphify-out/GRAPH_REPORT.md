# Graph Report - blog  (2026-09-14)

## Corpus Check
- 361 files · ~88,846 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .css 2, .woff2 1)

## Summary
- 495 nodes · 1070 edges · 27 communities (23 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- consts.ts
- secret.ts
- pager.ts
- GripLayer
- SizeLayer
- skin.js
- check-md-roundtrip.mjs
- sync-icons.mjs
- api/views.js
- astro.config.mjs
- editor.js
- content.config.ts
- upload.js
- editors.js
- registerWidget
- drafts.js
- shortcuts.js
- el
- sync-authors.mjs
- devDependencies
- scripts
- dependencies
- tsconfig.json
- post.sh
- package.json

## God Nodes (most connected - your core abstractions)
1. `el()` - 39 edges
2. `GripLayer` - 28 edges
3. `SizeLayer` - 22 edges
4. `getPublishedPosts()` - 21 edges
5. `openViewsPage()` - 19 edges
6. `pass()` - 17 edges
7. `registerWidget()` - 17 edges
8. `drawRows()` - 14 edges
9. `startSkin()` - 12 edges
10. `openDraftsPanel()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `getPublishedPosts()` --calls--> `getStaticPaths()`  [EXTRACTED]
  src/lib/posts.ts → src/pages/posts/[...slug].astro
- `postsByProject()` --calls--> `cards`  [EXTRACTED]
  src/lib/posts.ts → src/pages/projects/index.astro
- `registerPort()` --calls--> `registerWidget()`  [EXTRACTED]
  admin-src/drafts.js → admin-src/editor.js
- `buildSaveModal()` --calls--> `el()`  [EXTRACTED]
  admin-src/save.js → admin-src/say.js
- `finishSave()` --calls--> `draftSaved()`  [EXTRACTED]
  admin-src/save.js → admin-src/drafts.js

## Import Cycles
- None detected.

## Communities (27 total, 2 thin omitted)

### Community 0 - "consts.ts"
Cohesion: 0.06
Nodes (53): Author, AuthorColor, AuthorId, Project, ProjectId, ProjectLinkKind, Cover, IconName (+45 more)

### Community 14 - "secret.ts"
Cohesion: 0.31
Nodes (8): SealedContent, deriveKey(), getSecretPassword(), requireSecretPassword(), sealHtml(), toBase64(), ITERATIONS, te

### Community 16 - "pager.ts"
Cohesion: 0.39
Nodes (7): Options, sequence(), setupPager(), apply(), draw(), go(), PER_PAGE

### Community 3 - "GripLayer"
Cohesion: 0.09
Nodes (15): GripLayer, cellPos(), repCell(), spansOne(), startsHere(), syncCols(), tableAt(), tableOfSelection() (+7 more)

### Community 6 - "SizeLayer"
Cohesion: 0.14
Nodes (8): SizeLayer, anchorOf(), boxWidth(), posOfImage(), selectedImage(), ImageGrips, key, @tiptap/core

### Community 1 - "skin.js"
Cohesion: 0.08
Nodes (58): listDrafts(), registerPort(), buildSaveModal(), closeSaveModal(), confirmSave(), finishSave(), leaveToList(), onSaveIntent() (+50 more)

### Community 10 - "check-md-roundtrip.mjs"
Cohesion: 0.18
Nodes (7): changed, dom, editor, files, lost, showDiff, jsdom

### Community 11 - "sync-icons.mjs"
Cohesion: 0.18
Nodes (8): clash, dest, extra, extraNames, files, limNames, root, typeFile

### Community 15 - "api/views.js"
Cohesion: 0.47
Nodes (8): creds(), handler(), pipeline(), redis(), sameToken(), slugOf(), toCounts(), today()

### Community 2 - "editor.js"
Cohesion: 0.11
Nodes (21): htmlExtensions(), setAlignExtensions(), attrOf(), isRoundTripSafe(), makeEditor(), makeExtensions(), normalizeMarkdown(), Align (+13 more)

### Community 20 - "content.config.ts"
Cohesion: 0.40
Nodes (5): blankAsUndefined(), AUTHOR_IDS, PROJECT_IDS, collections, posts

### Community 30 - "upload.js"
Cohesion: 0.20
Nodes (13): firstTransform(), guardMediaLibrary(), healAsset(), imagesIn(), placeholderAt(), readCloudinary(), runUploads(), transformSegment() (+5 more)

### Community 4 - "editors.js"
Cohesion: 0.13
Nodes (30): addEditor(), avatar(), byId(), card(), clearCards(), colorOf(), countOf(), ctrl() (+22 more)

### Community 47 - "registerWidget"
Cohesion: 0.25
Nodes (4): draftField(), hasImageFile(), registerWidget(), slugStamp()

### Community 5 - "drafts.js"
Cohesion: 0.15
Nodes (29): ago(), draftAgo(), draftSaved(), draftsPass(), drop(), dropDraft(), entryKey(), flushPorts() (+21 more)

### Community 51 - "shortcuts.js"
Cohesion: 0.31
Nodes (7): blockAt(), setBlock(), BLOCKS, HEADING_LEVELS, BlockShortcuts, ImeShortcuts, ToolShortcuts

### Community 7 - "el"
Cohesion: 0.30
Nodes (20): el(), askToken(), bar(), daysCard(), dot(), entryHref(), listCard(), paint() (+12 more)

### Community 9 - "sync-authors.mjs"
Cohesion: 0.15
Nodes (13): q(), authors, begin, config, configFile, counts, dataFile, end (+5 more)

### Community 12 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, jsdom, @tiptap/core, @tiptap/extension-image, @tiptap/extension-list, @tiptap/extension-table, @tiptap/markdown (+2 more)

### Community 13 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, admin, astro, authors, build, cms, dev, icons (+2 more)

### Community 17 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, astro, @astrojs/rss, @astrojs/sitemap, sharp, @vercel/analytics, @vercel/speed-insights

### Community 18 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, strictNullChecks, exclude, extends, include, astro/tsconfigs/strict

### Community 8 - "package.json"
Cohesion: 0.13
Nodes (14): engines, node, name, type, version, esbuild, sharp, @tiptap/extension-image (+6 more)

## Knowledge Gaps
- **116 isolated node(s):** `AuthorColor`, `AuthorId`, `ProjectId`, `ProjectLinkKind`, `Options` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 142 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `astro` connect `consts.ts` to `package.json`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `@tiptap/core` connect `SizeLayer` to `editor.js`, `GripLayer`, `package.json`, `shortcuts.js`, `upload.js`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `@astrojs/rss` connect `consts.ts` to `package.json`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `AuthorColor`, `AuthorId`, `ProjectId` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `consts.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `GripLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.09413067552602436 - nodes in this community are weakly interconnected._
- **Should `SizeLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._