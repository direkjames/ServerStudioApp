// Seed data from the Server Studio playbook
const PILLARS=["Start Here (Studio Basics)","Fix It (Studio Fixes)","Plugin Spotlight (Studio Picks)","Grow Your Server (Studio Growth)","Trending & Shareable (Studio Teardown)"];
const IDEAS=[
 {
  "n": 1,
  "p": 0,
  "title": "How to Make a Minecraft Server in 10 Minutes (2026, Free)",
  "hook": "Your friends are waiting. By the end of this video, they'll be joining your server.",
  "concept": "Paper setup from download to first login, with port-forwarding alternatives and a free host option.",
  "thumb": "Server console, a JOIN button, a bold 10 MIN badge."
 },
 {
  "n": 2,
  "p": 0,
  "title": "I Made a Server So Easy My Little Cousin Set It Up",
  "hook": "I'm handing this laptop to a 10-year-old. No help. Timer starts now.",
  "concept": "Beginner-test format that shows exactly where new owners get stuck. Use a real tester or label it a staged demo.",
  "thumb": "Small hands on a keyboard (no face), a ticking timer, a red FAILED? stamp."
 },
 {
  "n": 3,
  "p": 0,
  "title": "Paper vs Spigot vs Fabric vs Forge: Which Server Should You Run?",
  "hook": "Pick wrong and you'll rebuild everything in a month.",
  "concept": "Decision flowchart based on goals: survival, mods, minigames.",
  "thumb": "Four logos in a fighting-game VS grid, one wearing a crown."
 },
 {
  "n": 4,
  "p": 0,
  "title": "How to Make a Server With Friends (Free, No Hosting Needed)",
  "hook": "You don't need to pay a cent for this.",
  "concept": "Aternos-style free hosts and local hosting, with honest limits for each.",
  "thumb": "$0 in huge text over a crossed-out price tag."
 },
 {
  "n": 5,
  "p": 0,
  "title": "7 Server Mistakes That Killed My First Community",
  "hook": "I had 40 players on day one. Day ten, I had two.",
  "concept": "Story-driven list: no rules, no events, wrong version. Use only true stories, or frame it as a case study.",
  "thumb": "A player-count graph crashing, with a red arrow."
 },
 {
  "n": 6,
  "p": 1,
  "title": "Fix Minecraft Server Lag in 5 Minutes",
  "hook": "Your TPS is dropping and you don't know why. Let's find it live.",
  "concept": "Spark profiler walkthrough, view distance, and entity limits.",
  "thumb": "TPS counter going from red 8 to green 20."
 },
 {
  "n": 7,
  "p": 1,
  "title": "The Aikar Flags Explained (Without the Jargon)",
  "hook": "Everyone says copy these flags. Nobody says what they do.",
  "concept": "JVM flags in plain language, with before and after benchmarks.",
  "thumb": "A scary code line under a magnifying glass, with WHAT?!"
 },
 {
  "n": 8,
  "p": 1,
  "title": "Why Your Server Keeps Crashing (7 Real Causes)",
  "hook": "Crash log. Red text. Panic. Here's how to read it.",
  "concept": "Decode five real crash logs and show the fix for each.",
  "thumb": "Giant red error text with a green FIXED check."
 },
 {
  "n": 9,
  "p": 1,
  "title": "Stop Griefers: Complete Server Protection Setup",
  "hook": "One griefer deleted 3 weeks of builds. Never again.",
  "concept": "WorldGuard and CoreProtect setup, with a live rollback demo.",
  "thumb": "A destroyed build rewinding, with a ROLLBACK arrow."
 },
 {
  "n": 10,
  "p": 1,
  "title": "How to Stop Hackers and Cheaters on Your Server",
  "hook": "A player just flew through your spawn. Here's how you catch them.",
  "concept": "Anti-cheat plugin comparison and tuning to avoid false bans.",
  "thumb": "A flagged player icon with a ban hammer."
 },
 {
  "n": 11,
  "p": 1,
  "title": "Your Server Is Slow Because of THIS (Not Your PC)",
  "hook": "Everyone blames hardware. It's almost never hardware.",
  "concept": "The common config culprits: redstone, hoppers, mob farms, chunk loading.",
  "thumb": "A hopper chain on fire with a LAG label."
 },
 {
  "n": 12,
  "p": 2,
  "title": "10 Plugins Every Server Needs (2026)",
  "hook": "Install these 10 and your server instantly feels professional.",
  "concept": "Essentials-level list with an install demo for each plugin.",
  "thumb": "Numbered icon grid with \"#1 will surprise you.\""
 },
 {
  "n": 13,
  "p": 2,
  "title": "Best Free Plugins You're Not Using",
  "hook": "These are free, tiny, and make players stay.",
  "concept": "Hidden-gem plugins for quality of life and visuals.",
  "thumb": "A FREE ribbon over a glowing chest."
 },
 {
  "n": 14,
  "p": 2,
  "title": "I Turned a Boring Survival Server Into a Mini-Game Network",
  "hook": "Same server. Same world. 24 hours. Let's see how far this goes.",
  "concept": "Timelapse build of lobby, minigames, ranks, and scoreboard.",
  "thumb": "Before and after split: boring dirt versus a glowing lobby."
 },
 {
  "n": 15,
  "p": 2,
  "title": "Custom Items and Mobs With Zero Coding",
  "hook": "You can add a boss to your server without writing a single line of Java.",
  "concept": "Datapack and plugin tools for custom loot and mobs.",
  "thumb": "A custom boss silhouette holding a sword."
 },
 {
  "n": 16,
  "p": 2,
  "title": "Do NOT Install This Plugin (Server Security Warning)",
  "hook": "Some plugins can quietly wreck your server.",
  "concept": "How to vet plugins, spot malicious ones, and use trusted sources.",
  "thumb": "A warning triangle over a plugin jar, with BACKDOOR?"
 },
 {
  "n": 17,
  "p": 3,
  "title": "How I Got My First 100 Players (Step by Step)",
  "hook": "Zero advertising budget. Here's exactly what I did.",
  "concept": "Listing sites, short clips, Discord, and partnerships. Only use if true; otherwise reframe as a tested plan.",
  "thumb": "A player counter climbing to 100."
 },
 {
  "n": 18,
  "p": 3,
  "title": "Why Players Join Your Server and Never Come Back",
  "hook": "You lose 8 out of 10 new players in the first 5 minutes.",
  "concept": "Onboarding teardown: spawn, tutorial, first reward.",
  "thumb": "A door with players walking out."
 },
 {
  "n": 19,
  "p": 3,
  "title": "The Perfect Spawn: What Makes Players Stay",
  "hook": "Your spawn is your storefront. Most are empty.",
  "concept": "Design principles with before and after builds.",
  "thumb": "Bland spawn versus polished spawn, with WHICH ONE?"
 },
 {
  "n": 20,
  "p": 3,
  "title": "How to Run Events That Actually Fill Your Server",
  "hook": "Events are the cheapest marketing you'll ever do.",
  "concept": "Five event formats with templates: build battle, hunger games, hide and seek.",
  "thumb": "Trophy, an EVENT NIGHT banner, a packed lobby."
 },
 {
  "n": 21,
  "p": 3,
  "title": "How to Get Free Players With Short Videos",
  "hook": "A 20-second clip got my server 300 joins.",
  "concept": "Clip formats for Shorts and TikTok. Label results as examples unless they are real.",
  "thumb": "A phone screen with an upward arrow."
 },
 {
  "n": 22,
  "p": 3,
  "title": "Can You Make Money From a Minecraft Server? (EULA Rules Explained)",
  "hook": "Yes, but one wrong shop item and you could get shut down.",
  "concept": "What the EULA allows (cosmetics, ranks) versus what it forbids (pay-to-win).",
  "thumb": "A $ symbol with a red ILLEGAL? slash."
 },
 {
  "n": 23,
  "p": 3,
  "title": "I Analyzed 20 Dead Servers So You Don't Have To",
  "hook": "These servers had thousands of players once. Look at them now.",
  "concept": "Respectful, anonymized teardown of public server failures.",
  "thumb": "A graveyard of server icons."
 },
 {
  "n": 24,
  "p": 4,
  "title": "I Hosted a Minecraft Server for 24 Hours With Subscribers",
  "hook": "I opened the server to everyone. Chaos is guaranteed.",
  "concept": "Community-run live recap with highlight clips and clear rules.",
  "thumb": "A crowd of player skins with a bold 24H."
 },
 {
  "n": 25,
  "p": 4,
  "title": "Server Owner Tier List: Plugins, Hosts, and Modpacks",
  "hook": "Ranking everything that matters. S tier to F tier. Fight me.",
  "concept": "Debate-bait tier lists that are very shareable and comment-heavy.",
  "thumb": "Classic tier list with a clear S and F."
 },
 {
  "n": 26,
  "p": 4,
  "title": "Rate My Server: Viewers Submit, I Roast and Fix",
  "hook": "Send me your server IP. I'll tell you exactly what's wrong.",
  "concept": "Recurring series with an audit checklist. Great for comments and repeat viewers.",
  "thumb": "A red-pen markup over a server screenshot."
 },
 {
  "n": 27,
  "p": 4,
  "title": "Minecraft Server vs Realm: Which Is Better for You?",
  "hook": "Realms cost money. Servers cost time. Which wins?",
  "concept": "Cost, control, and performance comparison.",
  "thumb": "VS split with price tags."
 },
 {
  "n": 28,
  "p": 4,
  "title": "How Big Servers Actually Work (Hypixel-Style Explained)",
  "hook": "How can one server handle thousands of players at once?",
  "concept": "Animated explanation of proxies, instances, and lobbies.",
  "thumb": "Network diagram with glowing nodes."
 },
 {
  "n": 29,
  "p": 4,
  "title": "Build a Server in 2026 From Scratch: Full Beginner Series (Ep. 1)",
  "hook": "Day one. Blank folder. Let's build a server people actually want to join.",
  "concept": "Episode-based build reused across the channel: lobby, ranks, economy, events.",
  "thumb": "A blank world with a DAY 1 tag."
 },
 {
  "n": 30,
  "p": 4,
  "title": "Server Owner Cheat Sheet: Every Command You Need",
  "hook": "Save this video. You'll need it at 2 a.m. when something breaks.",
  "concept": "Command reference with timestamps. High save rate and evergreen.",
  "thumb": "A command block with SAVE THIS."
 }
];
const PLAN=[
 {
  "day": 1,
  "type": "Short",
  "task": "Short: the \"Done!\" moment from #1 (recorded pre-launch)",
  "note": "Day 0 prep: #1 and #6 must be recorded and edited before Day 1. Link Short to #1 once live."
 },
 {
  "day": 2,
  "type": "Long-form",
  "task": "#1 How to Make a Minecraft Server in 10 Minutes (2026, Free)",
  "note": "Publish 4-5pm. Pin commands + links. Post to Community tab. Reply to comments for 48h."
 },
 {
  "day": 3,
  "type": "Short",
  "task": "Short: the start.bat line (copy-paste tip)",
  "note": "Related video: #1."
 },
 {
  "day": 4,
  "type": "Short",
  "task": "Short: whitelist in 15 seconds",
  "note": "Analytics: 30 min. Note CTR and first retention drop in #1."
 },
 {
  "day": 5,
  "type": "Short",
  "task": "Short: lag tip teaser (TPS going from red to green)",
  "note": "Make 3 thumbnail variants for #6."
 },
 {
  "day": 6,
  "type": "Long-form",
  "task": "#6 Fix Minecraft Server Lag in 5 Minutes",
  "note": "Publish 4-5pm. Reply to comments in the first 2 hours."
 },
 {
  "day": 7,
  "type": "Rest",
  "task": "Rest / batch-record Shorts",
  "note": "Weekly review: fill the Analytics Log. Pick next week topics."
 },
 {
  "day": 8,
  "type": "Short",
  "task": "Short: clip from #6 (Spark profiler moment)",
  "note": "Script #12 + #5."
 },
 {
  "day": 9,
  "type": "Long-form",
  "task": "#12 10 Plugins Every Server Needs (2026)",
  "note": "Publish 4-5pm. Pin plugin list + links."
 },
 {
  "day": 10,
  "type": "Short",
  "task": "Short: plugin pick #1 (one plugin, one benefit)",
  "note": ""
 },
 {
  "day": 11,
  "type": "Short",
  "task": "Short: plugin pick #2",
  "note": "Analytics check. Rewrite intros from retention drop-offs."
 },
 {
  "day": 12,
  "type": "Short",
  "task": "Short: mistake #1 teaser for #5",
  "note": "Thumbnail variants for #5. Use only true stories or frame as case study."
 },
 {
  "day": 13,
  "type": "Long-form",
  "task": "#5 7 Server Mistakes That Killed My First Community",
  "note": "Publish 4-5pm. Reply to comments in the first 2 hours."
 },
 {
  "day": 14,
  "type": "Rest",
  "task": "Rest / batch-record Shorts",
  "note": "Weekly review. Compare week 1 vs week 2 CTR and average % viewed."
 },
 {
  "day": 15,
  "type": "Short",
  "task": "Short: \"Pick wrong and you'll rebuild everything\" hook for #3",
  "note": "Script #3 + #9."
 },
 {
  "day": 16,
  "type": "Long-form",
  "task": "#3 Paper vs Spigot vs Fabric vs Forge: Which Server Should You Run?",
  "note": "Publish 4-5pm. Start A/B testing thumbnails (Test & compare)."
 },
 {
  "day": 17,
  "type": "Short",
  "task": "Short: Paper vs Fabric in one sentence",
  "note": ""
 },
 {
  "day": 18,
  "type": "Short",
  "task": "Short: rollback demo (CoreProtect)",
  "note": "Analytics check. Check \"When your viewers are on YouTube\" and adjust publish time if needed."
 },
 {
  "day": 19,
  "type": "Short",
  "task": "Short: CoreProtect rollback command tip",
  "note": "Thumbnail variants for #9."
 },
 {
  "day": 20,
  "type": "Long-form",
  "task": "#9 Stop Griefers: Complete Server Protection Setup",
  "note": "Publish 4-5pm. Pin commands."
 },
 {
  "day": 21,
  "type": "Rest",
  "task": "Rest / batch-record Shorts",
  "note": "Weekly review. Which video has best CTR x impressions?"
 },
 {
  "day": 22,
  "type": "Short",
  "task": "Short: before/after lobby clip for #14",
  "note": "Script #14 + #18."
 },
 {
  "day": 23,
  "type": "Long-form",
  "task": "#14 I Turned a Boring Survival Server Into a Mini-Game Network",
  "note": "Publish 4-5pm. Timelapse-heavy; keep re-hooks every 60-90s."
 },
 {
  "day": 24,
  "type": "Short",
  "task": "Short: onboarding tip (what a new player sees first)",
  "note": ""
 },
 {
  "day": 25,
  "type": "Short",
  "task": "Short: perfect spawn tip",
  "note": "Analytics check. Spot top 2 videos so far."
 },
 {
  "day": 26,
  "type": "Short",
  "task": "Short: \"no tutorial\" mistake clip for #18",
  "note": "Thumbnail variants for #18."
 },
 {
  "day": 27,
  "type": "Long-form",
  "task": "#18 Why Players Join Your Server and Never Come Back",
  "note": "Publish 4-5pm. Reply to comments in the first 2 hours."
 },
 {
  "day": 28,
  "type": "Rest",
  "task": "Rest / batch-record Shorts",
  "note": "Weekly review: week 4 totals."
 },
 {
  "day": 29,
  "type": "Short",
  "task": "Short: tier-list hot take teaser for #25",
  "note": "Script #25 + #10."
 },
 {
  "day": 30,
  "type": "Review",
  "task": "DAY-30 REVIEW + publish #25 Server Owner Tier List",
  "note": "Rank videos by CTR x impressions. Cut worst 25% topic type, double the best 25%. Publish #25 at 4-5pm."
 }
];
