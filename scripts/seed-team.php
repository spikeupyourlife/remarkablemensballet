<?php
/**
 * Seed (or update) team member pages in content/3_team/.
 *
 * Source of truth is the $people array in this file. Re-running rewrites
 * the person.txt files but does NOT touch attached photos or any new fields
 * the user added in the Panel, so it's safe to run after Spike has edited
 * in the Panel (as long as he keeps photos as separate files, which Kirby
 * does by default).
 *
 * Pages are created as LISTED (numeric prefix) so they appear immediately
 * on the team page. Spike's "I'll sanity check before going live" intent.
 *
 * Usage:
 *   php scripts/seed-team.php
 *   php scripts/seed-team.php --dry-run
 */

require __DIR__ . '/../kirby/bootstrap.php';

const TEAM_DIR = __DIR__ . '/../content/3_hall-of-fame';

$dryRun = in_array('--dry-run', array_slice($argv, 1), true) || in_array('-n', array_slice($argv, 1), true);

/**
 * Each entry creates a folder like "1_doug-kamo" containing person.txt.
 * Order matters, sets the numeric prefix and thus the default Panel sort.
 *
 * Fields map to person.yml blueprint:
 *   title, stageName, personType, role, bio, performingSince, performingUntil,
 *   isCurrent, showInList, featured, instagram, customLink, customLinkLabel,
 *   metaDescription
 */
$people = [

    // ─── Founders ────────────────────────────────────────────────────────────
    [
        'slug' => 'doug-kamo',
        'title' => 'Doug Kamo',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Co-founder · Performer',
        'bio' => <<<MD
Co-founded the Remarkable Men's Ballet with Simon Green in 2006, the prank that became a 20-year institution.

Doug is one of the busiest producers, directors and entertainment practitioners in the country, with 25+ years on stage and behind the curtain. As director and producer he's overseen 60+ musical theatre productions, including *Wicked*, *Mamma Mia*, *Grease: The Arena Spectacular*, *Mary Poppins*, *Priscilla Queen of the Desert*, *The Rocky Horror Show*, *Les Misérables*, *The Producers*, and *The Addams Family*. He toured New Zealand and Asia in international casts of *Chicago* and *Joseph and the Amazing Technicolor Dreamcoat*.

On radio: he hosted *Lotto* for two-and-a-half years, a string of travel and game shows, breakfast at More FM Queenstown, and currently fronts *Doug & P* on The Hits Dunedin, the most-awarded regional breakfast show in New Zealand.

As MC he handles around 40 conferences, awards and fundraisers a year. As founder, he handled the Remarkable Men's Ballet exactly once. It stuck.
MD,
        'performingSince' => '2006-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => true,
        'customLink' => 'https://www.dougkamomc.co.nz',
        'customLinkLabel' => 'Doug Kamo MC',
        'metaDescription' => 'Doug Kamo, Remarkable Men\'s Ballet co-founder, national entertainment producer, MC, broadcaster.',
    ],

    [
        'slug' => 'simon-green',
        'title' => 'Simon Green',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Co-founder · Performer',
        'bio' => <<<MD
Co-founded the Remarkable Men's Ballet with Doug Kamo in 2006.

Simon is a Queenstown community-arts fixture: trained professional singer and musician, **Director of the Queenstown Winter Festival for seven years**, and concert director of the Shotover Jet Remarkable Christmas Spectacular era (where he, Margaret O'Hanlon and Anna Stuart were dubbed the "creative dream team" by the ODT in 2010). Sat at the centre of two of the resort's biggest community celebrations for years.

The RMB began as a one-off bit between Simon and Doug, a small comic act in a much bigger show. Twenty years on, it's the bit everyone comes back for.
MD,
        'performingSince' => '2006-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => true,
        'metaDescription' => 'Simon Green, Remarkable Men\'s Ballet co-founder, professional musician, 7-year Queenstown Winter Festival director.',
    ],

    // ─── The current lead ─────────────────────────────────────────────────────
    [
        'slug' => 'craig-ferguson',
        'title' => 'Craig Ferguson',
        'stageName' => 'Ferg',
        'personType' => 'performer',
        'role' => 'Head "Mincer" · Performer',
        'bio' => <<<MD
> *Long-serving Queenstown radio broadcaster, four-term councillor, and the man whose dodgy knee keeps almost-but-not-quite ending the Remarkable Men's Ballet every year.*

Raised in Hamilton, Craig played rugby for the New Zealand Colts and the Junior All Blacks before "keeping Jock Hobbs out of age-group rugby", until he got injured and Hobbs took the chance to become an All Blacks captain. After arriving in Queenstown for a ski holiday in '87, Craig stayed: liftie at Coronet Peak, wine waiter at Skyline, tour driver, then captain of Wakatipu Premiers rugby.

Station boss Chas Drader poached him from the tour bus into a job at Q92FM, and he's been on Queenstown breakfast radio ever since, currently with The Hits, marking 30+ years on local airwaves. He's chaired the Bruce Grant Youth Trust since its founding, MC'd more community fundraisers than he can count, and has served on the Queenstown Lakes District Council since 2013.

He's been on the Remarkable Men's Ballet roster since at least 2011, and as of 2024 was the troupe's "head mincer". He admits his dancing career is *"a bit limited now, dodgy old left knee from rugby days"*, but he keeps showing up anyway.
MD,
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => true,
        'metaDescription' => 'Craig "Ferg" Ferguson, head of the Remarkable Men\'s Ballet, Queenstown radio host and councillor.',
    ],

    // ─── Notable / mayors ─────────────────────────────────────────────────────
    [
        'slug' => 'clive-geddes',
        'title' => 'Clive Geddes',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Former Mayor, Queenstown Lakes',
        'bio' => <<<MD
Former Queenstown Lakes District Mayor. Performed with the Remarkables Christmas Male Ballet Company at the 2009 concert, the earliest "tutu-wearing mayor" data point we have on file.

Mentioned in the ODT's preview of the 2010 Christmas Spectacular: *"…the Remarkables Christmas Male Ballet Company, who performed at the 2009 concert with then-mayor Clive Geddes."*

The ODT's own 2009 report (*Mayoral turn dazzles at Christmas Spectacular*, James Beech, 14 December 2009) adds the detail: he was a surprise eleventh-hour replacement "ballerina", pirouetting in a tutu alongside the other 29 members of the company to a rock version of Beethoven's Fifth Symphony.
MD,
        'performingSince' => '2009-12-01',
        'performingUntil' => '2009-12-31',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Clive Geddes, former Queenstown Lakes mayor and 2009 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'peter-laurenson',
        'title' => 'Peter Laurenson',
        'stageName' => 'Pete',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => <<<MD
Known to most as **Pete**. Joined the troupe as a performer in 2024 alongside Jake Neaves, though he's been RMB-adjacent for a while: his wife, **Vanessa van Uden**, was Queenstown Lakes Mayor 2010–2016 and made multiple cameo appearances with the troupe during her mayoralty. Most memorably:

- **2011**: as the sitting mayor, Vanessa stole the men's flowers and was wrapped in tinsel and carried offstage by the "ballerinas"
- **2016**: in her last year as mayor, she performed "I Will Survive" with the Men's Ballet

So the Laurensons have been RMB-orbit for over a decade, Pete just finally crossed the floor in 2024 from spectator/spouse to tutu-wearer himself.

(Vanessa and Pete met at St Hilda's in Dunedin and married in 1989.)
MD,
        'performingSince' => '2024-12-01',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Peter "Pete" Laurenson, Remarkable Men\'s Ballet performer since 2024.',
    ],

    [
        'slug' => 'jake-neaves',
        'title' => 'Jake Neaves',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Volunteer Firefighter',
        'bio' => <<<MD
Joined the troupe in 2024, one of two new faces that year. A Queenstown volunteer firefighter by day; tutu-wearer by Christmas.

The 2024 show was the year of the presents (no tutus), Ferg told the ODT the troupe was "still a bit sore" about the tutu absence. Jake had to make do with corrugated cardboard and a sense of humour.
MD,
        'performingSince' => '2024-12-01',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Jake Neaves, Queenstown volunteer firefighter and Remarkable Men\'s Ballet performer since 2024.',
    ],

    [
        'slug' => 'mark-taylor',
        'title' => 'Mark Taylor',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Builder',
        'bio' => <<<MD
Builder by trade. Assistant Manager at [Jennian Homes Central Otago and Queenstown](https://jennian.co.nz/franchises/central-otago-and-queenstown), the region's long-running custom design-and-build franchise with offices in Queenstown and Alexandra, twenty-plus years in the region.

Also connected with [Queenstown Carpenters](https://www.facebook.com/p/Queenstown-Carpenters-100062974042478/), keeping the tools sharp.

New to the Remarkable Men's Ballet troupe. We assume the builder-level precision will translate to the choreography. Time will tell.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'customLink' => 'https://jennian.co.nz/franchises/central-otago-and-queenstown',
        'customLinkLabel' => 'Jennian Homes Central Otago',
        'metaDescription' => 'Mark Taylor, builder, Jennian Homes Central Otago Assistant Manager, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'uan-spijkerbosch',
        'title' => 'Uan Spijkerbosch',
        'stageName' => 'Balletman',
        'personType' => 'performer',
        'role' => 'Performer · "Balletman"',
        'bio' => <<<MD
Stage name: **Balletman**.

Quoted in the ODT in April 2025 ahead of the troupe's appearance at the Arrowtown Autumn Festival, the first time the RMB had performed outside the Christmas Show, sounding very ready for it: *"We think we've got it. It's solid, it's dynamic, and we've nailed it."*

The 2025 Arrowtown routine was choreographed by Claire Hazledine and set to Vivaldi's *Autumn*.

Also, purely coincidentally, the person who decided to build this website.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => true,
        'metaDescription' => 'Uan "Balletman" Spijkerbosch, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'jim-curry',
        'title' => 'Jim Curry',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => <<<MD
Performed at the 2025 Arrowtown Autumn Festival, the troupe's first appearance outside the Christmas Show. Choreography by Claire Hazledine, set to Vivaldi's *Autumn*.

Full bio coming.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Jim Curry, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'nigel-kerr',
        'title' => 'Nigel Kerr',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Coronet Peak Ski Area Manager',
        'bio' => <<<MD
Wakatipu local with deep ski-industry roots. Started as a ski and snowboard instructor in the 1980s, then spent **21 years at Cardrona** before broadening into commercial and marketing roles, at The Good Group, his own marketing consultancy, and as Marketing Manager for Ngāi Tahu Tourism in Queenstown.

Since February 2017 he's been the **Coronet Peak Ski Area Manager**, running the closest mountain to town. Forty-odd years of moving people up and down hills, in dignified ski wear and (apparently) the occasional tutu.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Nigel Kerr, Coronet Peak Ski Area Manager and Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'david-kennedy',
        'title' => 'David Kennedy',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Tourism Chief Executive',
        'bio' => <<<MD
Queenstown tourism heavyweight, the public face of selling this place for over a quarter-century.

Tempted from Wellington in 1998, where he'd been at Tourism Wellington and helped organise the **Queenstown Winter Festival in the 1990s** (long before the RMB ever turned up at one). Spent **nearly 10 years as Chief Executive of Destination Queenstown**, then **eight years as Regional General Manager – South Island at Ngāi Tahu Tourism**, and is now Chief Executive of **Ngāi Tahu Property**.

Along the way, he led Eden Park through two World Cups, and is currently shepherding the **Te Pā Tāhuna** residential development in Queenstown, 350+ homes including 100+ KiwiBuild apartments on the former high school site.

Sold Queenstown to the world for a quarter century. And apparently also wore a tutu for it.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'David Kennedy, former Destination Queenstown CEO, Ngāi Tahu Property CE, Eden Park, and Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'shaun-drader',
        'title' => 'Shaun Drader',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Queenstown Police',
        'bio' => <<<MD
A Queenstown police constable, almost certainly part of THE Drader family, given the surname (his father / uncle was Chas Drader, founder of Q92FM and the broadcasting mentor who put Craig "Ferg" Ferguson on the radio in the first place).

A 2009 CNN article credited Constable Sean Drader for pioneering the Queenstown police's use of Facebook for community engagement, at the time he was working as an intelligence analyst for QPD. Family had skied at Coronet Peak for over 10 years.

The Drader-to-Ferg-to-RMB lineage is one of those small-town threads that runs through this whole story.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Shaun Drader, Queenstown police constable and Remarkable Men\'s Ballet performer.',
    ],

    // ─── Spike's added list (years TBC) ──────────────────────────────────────
    [
        'slug' => 'bert-haines',
        'title' => 'Bert Haines',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Queenstown Hospitality',
        'bio' => <<<MD
General Manager and co-founder of **Future Hospitality Group**, the people behind Margo's, Little Blackwood, Minus 5° ICE BAR and Rhino's Ski Shack. Two-plus decades in NZ hospitality.

Bert and business partner James Ace took advantage of the pandemic's quiet stretch to open two new venues in 2020. Future Hospitality has since grown from 2 venues to 7 across Queenstown. Bert was a finalist for Hospitality Leader of the Year at the 2024 Hospitality New Zealand Awards For Excellence. He sits on the National Committee of Hospitality New Zealand and is vocal about elevating the industry's reputation and developing emerging leaders.

Hospitality icon by day, tutu-wearer when Ferg asks nicely.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'customLink' => 'https://www.hospitality.org.nz/about-us/our-people/bert-haines',
        'customLinkLabel' => 'Bert on Hospitality NZ',
        'metaDescription' => 'Bert Haines, co-founder Future Hospitality Group, Hospitality NZ National Committee, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'rich-hatchett',
        'title' => 'Rich Hatchett',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Bio coming. Confirmed Remarkable Men's Ballet performer, full story still being collected.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Rich Hatchett, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'steve-gallagher',
        'title' => 'Steve Gallagher',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Bio coming. Confirmed Remarkable Men's Ballet performer, full story still being collected.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Steve Gallagher, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'steve-kay',
        'title' => 'Steve Kay',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Historic Remarkable Men's Ballet performer. Full bio coming.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Steve Kay, historic Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'gary-clearwater',
        'title' => 'Gary Clearwater',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Bio coming. Confirmed Remarkable Men's Ballet performer, full story still being collected.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Gary Clearwater, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'paul-robinson',
        'title' => 'Paul Robinson',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Bio coming. Confirmed Remarkable Men's Ballet performer, full story still being collected.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Paul Robinson, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'mike-thurston',
        'title' => 'Mike Thurston',
        'stageName' => 'Cookie',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Known to the troupe as **Cookie**. Bio coming.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Mike "Cookie" Thurston, Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'dave-mahony',
        'title' => 'Dave Mahony',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Bio coming. Confirmed Remarkable Men's Ballet performer, full story still being collected.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Dave Mahony, Remarkable Men\'s Ballet performer.',
    ],

    // ─── The 2011 cohort (per James Beech's ODT column) ──────────────────────
    [
        'slug' => 'james-beech',
        'title' => 'James Beech',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Journalist',
        'bio' => <<<MD
ODT journalist whose first-person column from inside the 2011 RMB rehearsal is, twelve years on, the most useful list of cast names we've got.

In December 2011, James wrote the *"Lissom lads"* piece for the Otago Daily Times as an embedded participant: describing the costume reveal (*"duct tape will be needed at the back of mine while I'm flouncing around otherwise our show will instantly go from ballet to burlesque"*), Anna Stuart's saintly patience as choreographer, and the manoeuvre where he and Ferg hoist Rowan McDonald into the air.

The 2011 lineup he documented: Craig Ferguson, Graeme Jackson, Paul van der Kaag, Tony Moore, Simon Thew, Henry Youngman, Irik Anderson, Darren Craig, JD Marrable, Chris Dagg, Andrew Bisset, and James himself.
MD,
        'performingSince' => '2011-12-01',
        'performingUntil' => '2011-12-31',
        'isCurrent' => false,
        'featured' => false,
        'customLink' => 'https://www.odt.co.nz/regions/queenstown-lakes/these-lissom-lads-are-agile-swanlike-epitome-grace',
        'customLinkLabel' => 'James\' 2011 ODT column',
        'metaDescription' => 'James Beech, 2011 Remarkable Men\'s Ballet performer and ODT journalist.',
    ],

    [
        'slug' => 'graeme-jackson',
        'title' => 'Graeme Jackson',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Graeme Jackson, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'paul-van-der-kaag',
        'title' => 'Paul van der Kaag',
        'stageName' => 'Tall Paul',
        'personType' => 'performer',
        'role' => 'Performer · "Tall Paul"',
        'bio' => <<<MD
**6 ft 5 in. Dutch-Australian. 40+ years a Queenstown adventurer.** The 2011 troupe knew him only as **"Tall Paul"**.

Grew up in Sydney in an athletic family: skiing, boating, surfing. Landed in Queenstown in 1985 with mate Tom Ellis for a ski season: bartender at Lakeland Hotel by night, skiing by day. Trained as a whitewater rafting guide with Kawarau Rafts, met Brigit (then a van driver for the rafting company), and the pair went to Switzerland to learn paragliding before co-founding **Max Air Parapenting** with Ged Hay back home.

Married Brigit in 1991. Bought **Impact Screen Prints** the same year and ran it for 25 years (with sister brands Queenstown Cap & Clothing Co and Embroidery Action), won the 2012 Chamber of Commerce Small Business Award. At the gala dinner he vowed to paddleboard from Kelvin Heights back into town, still in black tie. (History is mum on whether he did.)

Competed in the inaugural **1989 Raid Gauloise Grand Traverse** endurance race, placed second. Former Wakatipu Ski Club president. Contributed to national stand-up paddleboarding regulations. Now works as a skipper and guide in Fiordland.

Confirmed in the 2011 RMB lineup (ODT, *Meet the lords of the dance*).
MD,
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => '"Tall Paul" van der Kaag, Dutch-Australian Queenstown adventurer and 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'tony-moore',
        'title' => 'Tony Moore',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Tony Moore, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'simon-thew',
        'title' => 'Simon Thew',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Simon Thew, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'henry-youngman',
        'title' => 'Henry Youngman',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Henry Youngman, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'irik-anderson',
        'title' => 'Irik Anderson',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Full bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Irik Anderson, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'darren-craig',
        'title' => 'Darren Craig',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Darren Craig, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'jd-marrable',
        'title' => 'JD Marrable',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer',
        'bio' => "Confirmed in the 2011 lineup (ODT, *Lissom Lads*). Bio coming.",
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'JD Marrable, 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'chris-dagg',
        'title' => 'Chris Dagg',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Distance Runner · Farmer',
        'bio' => <<<MD
Former competitive distance runner, *"dominated the local (and national) running scene in the days when Queenstown was a force in distance running."* Now a Queenstown farmer; his land hosts a sediment trap constructed by the Mana Tahuna Charitable Trust.

Confirmed in the 2011 RMB lineup (ODT, *Meet the lords of the dance*).
MD,
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'metaDescription' => 'Chris Dagg, former Queenstown distance runner, farmer, and 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'andrew-bisset',
        'title' => 'Andrew Bisset',
        'stageName' => '',
        'personType' => 'performer',
        'role' => 'Performer · Wine Trail MD',
        'bio' => <<<MD
Managing Director of [Queenstown Wine Trail](https://queenstownwinetrail.co.nz). His CV maps onto pretty much every facet of running this town: previously at Southern Lakes Info Centre, Queenstown Lakes District Council, Apex Car Rentals.

Confirmed in the 2011 RMB lineup (ODT, *Meet the lords of the dance*).
MD,
        'performingSince' => '2011-12-01',
        'performingUntil' => '',
        'isCurrent' => false,
        'featured' => false,
        'customLink' => 'https://queenstownwinetrail.co.nz',
        'customLinkLabel' => 'Queenstown Wine Trail',
        'metaDescription' => 'Andrew Bisset, Queenstown Wine Trail MD and 2011 Remarkable Men\'s Ballet performer.',
    ],

    [
        'slug' => 'james-the-rabbit-man',
        'title' => "James 'the Rabbit Man'",
        'stageName' => 'The Rabbit Man',
        'personType' => 'performer',
        'role' => 'Performer · Newest recruit',
        'bio' => "The newest member of the company, known to the troupe only as **the Rabbit Man**. Surname classified. Origin of the nickname under investigation. Full bio coming soon.",
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => "James 'the Rabbit Man', the newest Remarkable Men's Ballet recruit.",
    ],

    // ─── Choreographers ──────────────────────────────────────────────────────
    [
        'slug' => 'anna-stuart',
        'title' => 'Anna Stuart',
        'stageName' => '',
        'personType' => 'choreographer',
        'role' => 'Choreographer · Founder-Director, DEVOS',
        'bio' => <<<MD
The choreographer with the patience of a saint, and the woman who has, on more than one occasion, buried her face in her hands during RMB rehearsals.

Anna started dancing at 8 (RAD Ballet, AJDA Jazz, NZAMD Jazz, BBO Tap) and won a scholarship to the **NZ School of Ballet at 12**. She took over her tap teacher's school at 15 (renaming it Marlborough School of Dance), moved to Queenstown in 2003 to dance and choreograph in *Starry Eyed*, Margaret O'Hanlon and Nigel Hirst's creation that became the genesis of what we now call the Christmas Show.

In **2006**, the same year the Remarkable Men's Ballet was founded, she co-founded **Queenstown School of Dance** with Lee van der Schuit. She rebranded it **DEVOS (Dance Evolution Studios)** in 2021 to teach more holistically, focusing on mindful movement and mental wellness as much as technique. At 40, she earned her APDA JazzAddict Solo Seal with Distinction. She's a certified dance examiner for the Asia Pacific Dance Association and a Resident Artist at Te Atamira.

Anna has been the **official choreographer of the Queenstown Christmas Show since 2013**, and has been wrestling the RMB into formation since at least 2010. James Beech's 2011 ODT column captures her gentle martyrdom: *"What happened to my quiet little fairies?"* she asked when the men waltzed toward her *"like a herd of crazed elephants."*

Without her, this would be a brawl. With her, it's just barely ballet.
MD,
        'performingSince' => '2010-01-01',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => true,
        'customLink' => 'https://www.devos.co.nz',
        'customLinkLabel' => 'DEVOS (Dance Evolution Studios)',
        'metaDescription' => 'Anna Stuart, Remarkable Men\'s Ballet choreographer, DEVOS founder-director, Queenstown Christmas Show choreographer since 2013.',
    ],

    [
        'slug' => 'claire-hazledine',
        'title' => 'Claire Hazledine',
        'stageName' => '',
        'personType' => 'choreographer',
        'role' => 'Choreographer',
        'bio' => <<<MD
Choreographer for the Remarkable Men's Ballet. Choreographed the troupe's 2025 Arrowtown Autumn Festival routine, set to Vivaldi's *Autumn*, for the troupe's first ever appearance outside the Christmas Show.

Full bio coming.
MD,
        'performingSince' => '',
        'performingUntil' => '',
        'isCurrent' => true,
        'featured' => false,
        'metaDescription' => 'Claire Hazledine, Remarkable Men\'s Ballet choreographer.',
    ],
];

// ─── Roster rules (Spike, 14 Oct 2026) ───────────────────────────────────────
// Current company = the troupe chat group. Everyone else is alumni.
// Applied on every run, so this is the source of truth for isCurrent.
const CURRENT_COMPANY = [
    'uan-spijkerbosch', 'craig-ferguson', 'bert-haines', 'claire-hazledine',
    'irik-anderson', 'jake-neaves', 'rich-hatchett', 'steve-gallagher',
    'steve-kay', 'gary-clearwater', 'mark-taylor', 'mike-thurston',
    'peter-laurenson', 'paul-robinson', 'james-the-rabbit-man',
];
// Removed from the roster entirely (folder deleted if present).
const REMOVED = ['glyn-lewers'];

$overrides = [
    'doug-kamo' => [
        'role' => 'Co-founder (alumnus)',
        'featured' => false,
        'bio' => 'Co-founded the Remarkable Men\'s Ballet with Simon Green at the very first Christmas Show: the prank that became a twenty-year institution. A well-known New Zealand entertainer, director and MC, Doug has since moved on to other stages. He takes our eternal gratitude, and a fair share of the blame, with him.',
        'metaDescription' => 'Doug Kamo, co-founder of the Remarkable Men\'s Ballet.',
    ],
    'clive-geddes' => [
        'bio' => 'Former Queenstown Lakes District Mayor, and a Remarkable Men\'s Ballet performer at the 2009 Shotover Jet Remarkable Christmas Spectacular.

The ODT\'s report from that year (*Mayoral turn dazzles at Christmas Spectacular*, James Beech, 14 December 2009) records that he stepped in as an eleventh-hour replacement "ballerina", dancing in a tutu alongside the other 29 members of the company to a rock version of Beethoven\'s Fifth Symphony.

The ODT\'s preview of the 2010 show remembered it too: *"...the Remarkables Christmas Male Ballet Company, who performed at the 2009 concert with then-mayor Clive Geddes."*',
        'metaDescription' => 'Clive Geddes, former Queenstown Lakes mayor and 2009 Remarkable Men\'s Ballet performer.',
    ],
    'bert-haines' => [
        'role' => 'Performer',
        'bio' => 'Queenstown hospitality stalwart and current member of the company. Hospitality icon by day, tutu-wearer when Ferg asks nicely. Full dossier coming soon.',
        'metaDescription' => 'Bert Haines, Remarkable Men\'s Ballet performer.',
        'customLink' => '',
        'customLinkLabel' => '',
    ],
    'mark-taylor' => [
        'role' => 'Performer',
        'bio' => 'Builder by trade, and one of the newer members of the company. We assume builder-level precision will translate to the choreography. Time will tell.',
        'metaDescription' => 'Mark Taylor, Remarkable Men\'s Ballet performer.',
        'customLink' => '',
        'customLinkLabel' => '',
    ],
    'nigel-kerr' => [
        'role' => 'Performer',
        'bio' => 'Listed in the Remarkable Men\'s Ballet archive. We\'re still confirming the details of his time in the tutu, so if you were there, [tell us](/contact).',
        'metaDescription' => 'Nigel Kerr, Remarkable Men\'s Ballet archive.',
        'customLink' => '',
        'customLinkLabel' => '',
    ],
    'david-kennedy' => [
        'role' => 'Performer',
        'bio' => 'Listed in the Remarkable Men\'s Ballet archive. We\'re still confirming the details of his time in the tutu, so if you were there, [tell us](/contact).',
        'metaDescription' => 'David Kennedy, Remarkable Men\'s Ballet archive.',
        'customLink' => '',
        'customLinkLabel' => '',
    ],
    'shaun-drader' => [
        'role' => 'Performer · Police Constable',
        'bio' => 'A Queenstown police constable and past member of the company, and living proof that the long arm of the law can manage a passable port de bras. Full bio coming soon.',
        'metaDescription' => 'Shaun Drader, Remarkable Men\'s Ballet performer.',
        'customLink' => '',
        'customLinkLabel' => '',
    ],
    'irik-anderson' => [
        'bio' => 'One of the longest-serving men on the books. Irik was in the Class of 2011 (ODT, *Meet the lords of the dance*), and was back in a tutu for the troupe\'s first ever outside gig, the 2025 Arrowtown Autumn Festival, dancing Claire Hazledine\'s routine to Vivaldi\'s *Autumn*. Fourteen years between press mentions and not a step forgotten. Allegedly.',
        'metaDescription' => 'Irik Anderson, Remarkable Men\'s Ballet performer since 2011.',
    ],
    'steve-kay' => [
        'bio' => 'Current member of the company, and part of the six-man line-up that took the troupe beyond the Christmas Show for the first time, at the 2025 Arrowtown Autumn Festival (choreography by Claire Hazledine, music by Vivaldi, nerves by Steve). Full dossier coming soon.',
        'metaDescription' => 'Steve Kay, Remarkable Men\'s Ballet performer.',
    ],
    'jim-curry' => [
        'bio' => 'Part of the six-man line-up for the troupe\'s first ever appearance outside the Christmas Show, at the 2025 Arrowtown Autumn Festival, dancing Claire Hazledine\'s routine to Vivaldi\'s *Autumn*. A short career, but a historic one.',
        'metaDescription' => 'Jim Curry, Remarkable Men\'s Ballet performer (Arrowtown 2025).',
    ],
    'claire-hazledine' => [
        'bio' => 'The choreographer who took the Remarkable Men\'s Ballet on tour. Claire created the troupe\'s 2025 Arrowtown Autumn Festival routine, set to Vivaldi\'s *Autumn*, for the first time the men had ever performed outside the Christmas Show. Arrowtown invited them back in 2026, which we choose to read as a review of her work rather than ours. Full bio coming soon.',
        'metaDescription' => 'Claire Hazledine, Remarkable Men\'s Ballet choreographer.',
    ],
    'anna-stuart' => [
        'role' => 'Former choreographer · Founder-Director, DEVOS',
    ],
    'steve-gallagher' => [
        'bio' => 'Full name **Steven Michael Gallagher**, which is far too many names for one tutu. Current member of the company. Further details withheld pending legal advice. Full dossier coming soon.',
    ],
    'paul-robinson' => [
        'stageName' => 'Robbo',
        'bio' => 'Known to the troupe as **Robbo**. Current member of the company. Further details withheld pending legal advice. Full dossier coming soon.',
        'metaDescription' => 'Paul "Robbo" Robinson, Remarkable Men\'s Ballet performer.',
    ],
    'mike-thurston' => [
        'bio' => 'Known to the troupe as **Cookie**. Current member of the company. Further details withheld pending legal advice. Full dossier coming soon.',
    ],
    'rich-hatchett' => [
        'bio' => 'Current member of the company. Further details withheld pending legal advice. Full dossier coming soon.',
    ],
    'gary-clearwater' => [
        'bio' => 'Current member of the company. Further details withheld pending legal advice. Full dossier coming soon.',
    ],
    'dave-mahony' => [
        'bio' => 'Past member of the company. Further details withheld pending legal advice. Full dossier coming soon.',
    ],
    'graeme-jackson' => [
        'bio' => 'Graeme was one of the Class of 2011: a dozen sturdy blokes rehearsing in the Queenstown Primary School Hall under Anna Stuart, then in her second year of trying, for the 2011 Shotover Jet Christmas Spectacular. The routine was a waltz from *The Nutcracker*, complete with imaginary harps and bouquets. Fellow recruit James Beech reported in the ODT that the men\'s respect for real ballet dancers rose tenfold. Full bio coming soon.',
    ],
    'tony-moore' => [
        'bio' => 'Tony was one of the Class of 2011: a dozen sturdy blokes rehearsing in the Queenstown Primary School Hall under Anna Stuart, then in her second year of trying, for the 2011 Shotover Jet Christmas Spectacular. The routine was a waltz from *The Nutcracker*, complete with imaginary harps and bouquets. Fellow recruit James Beech reported in the ODT that the men\'s respect for real ballet dancers rose tenfold. Full bio coming soon.',
    ],
    'simon-thew' => [
        'bio' => 'Simon was one of the Class of 2011: a dozen sturdy blokes rehearsing in the Queenstown Primary School Hall under Anna Stuart, then in her second year of trying, for the 2011 Shotover Jet Christmas Spectacular. The routine was a waltz from *The Nutcracker*, complete with imaginary harps and bouquets. Fellow recruit James Beech reported in the ODT that the men\'s respect for real ballet dancers rose tenfold. Full bio coming soon.',
    ],
    'henry-youngman' => [
        'bio' => 'Henry was one of the Class of 2011: a dozen sturdy blokes rehearsing in the Queenstown Primary School Hall under Anna Stuart, then in her second year of trying, for the 2011 Shotover Jet Christmas Spectacular. The routine was a waltz from *The Nutcracker*, complete with imaginary harps and bouquets. Fellow recruit James Beech reported in the ODT that the men\'s respect for real ballet dancers rose tenfold. Full bio coming soon.',
    ],
    'darren-craig' => [
        'bio' => 'Darren was one of the Class of 2011: a dozen sturdy blokes rehearsing in the Queenstown Primary School Hall under Anna Stuart, then in her second year of trying, for the 2011 Shotover Jet Christmas Spectacular. The routine was a waltz from *The Nutcracker*, complete with imaginary harps and bouquets. Fellow recruit James Beech reported in the ODT that the men\'s respect for real ballet dancers rose tenfold. Full bio coming soon.',
    ],
    'jd-marrable' => [
        'bio' => 'JD was one of the Class of 2011: a dozen sturdy blokes rehearsing in the Queenstown Primary School Hall under Anna Stuart, then in her second year of trying, for the 2011 Shotover Jet Christmas Spectacular. The routine was a waltz from *The Nutcracker*, complete with imaginary harps and bouquets. Fellow recruit James Beech reported in the ODT that the men\'s respect for real ballet dancers rose tenfold. Full bio coming soon.',
    ],
];

foreach ($people as &$p) {
    $p['isCurrent'] = in_array($p['slug'], CURRENT_COMPANY, true);
    if (isset($overrides[$p['slug']])) $p = array_merge($p, $overrides[$p['slug']]);
}
unset($p);
$people = array_values(array_filter($people, fn($p) => !in_array($p['slug'], REMOVED, true)));

if (!$dryRun) {
    foreach (REMOVED as $slug) {
        foreach (glob(TEAM_DIR . '/*_' . $slug) ?: [] as $dir) {
            foreach (glob($dir . '/*') as $f) unlink($f);
            rmdir($dir);
            echo "  - removed " . basename($dir) . "\n";
        }
    }
}

// ─── Generate ────────────────────────────────────────────────────────────────

function asKirbyBool($b): string {
    return $b ? 'true' : 'false';
}

function field(string $key, $value): string {
    if (is_bool($value)) $value = asKirbyBool($value);
    $value = (string) $value;
    // Multi-line values get a blank line after the colon
    if (str_contains($value, "\n")) {
        return ucfirst($key) . ":\n\n" . $value;
    }
    return ucfirst($key) . ": " . $value;
}

$created = 0;
$updated = 0;
$renamed = 0;

// First pass, move any existing folders out of the way to temp names,
// so we can confidently rename them to their desired prefix in pass 2
// without collisions cascading.
if (!$dryRun) {
    foreach ($people as $p) {
        $slug = $p['slug'];
        $existing = glob(TEAM_DIR . '/*_' . $slug);
        if ($existing) {
            $tmp = TEAM_DIR . '/__seed_tmp_' . $slug;
            if ($existing[0] !== $tmp) {
                rename($existing[0], $tmp);
            }
        }
    }
}

// Second pass, write each entry at its desired prefix.
foreach ($people as $i => $p) {
    $prefix = $i + 1;
    $slug = $p['slug'];
    $desiredDir = TEAM_DIR . '/' . $prefix . '_' . $slug;
    $tmp        = TEAM_DIR . '/__seed_tmp_' . $slug;

    if ($dryRun) {
        $action = is_dir(TEAM_DIR . '/' . $prefix . '_' . $slug) ? 'keep' : (
                  glob(TEAM_DIR . '/*_' . $slug) ? 'rename+update' : 'create');
        echo "  would {$action} " . $prefix . '_' . $slug . "\n";
        continue;
    }

    if (is_dir($tmp)) {
        // Rename temp → desired
        if ($tmp !== $desiredDir) {
            rename($tmp, $desiredDir);
            $renamed++;
        }
        $action = 'update';
    } elseif (is_dir($desiredDir)) {
        // Already in place
        $action = 'update';
    } else {
        mkdir($desiredDir, 0755, true);
        $action = 'create';
    }
    $dir = $desiredDir;

    $parts = [
        field('title',            $p['title']),
        field('stagename',        $p['stageName']),
        field('persontype',       $p['personType']),
        field('role',             $p['role']),
        field('bio',              $p['bio']),
        field('performingsince',  $p['performingSince']),
        field('performinguntil',  $p['performingUntil']),
        field('iscurrent',        $p['isCurrent']),
        field('showinlist',       true),
        field('featured',         $p['featured']),
        field('instagram',        $p['instagram'] ?? ''),
        field('customlink',       $p['customLink'] ?? ''),
        field('customlinklabel',  $p['customLinkLabel'] ?? ''),
        field('metadescription',  $p['metaDescription'] ?? ''),
    ];

    $content = implode("\n\n----\n\n", $parts) . "\n";
    file_put_contents($dir . '/person.txt', $content);

    if ($action === 'create') $created++; else $updated++;
    echo "  ✓ " . basename($dir) . " ({$action})\n";
}

echo str_repeat('-', 60) . "\n";
echo "Created: {$created}  Updated: {$updated}  Renamed: {$renamed}  Total: " . count($people) . "\n";
