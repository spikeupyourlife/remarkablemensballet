<?php
/**
 * Seed (or update) press articles in content/7_press/.
 *
 * Source of truth is the $articles array below. Re-runs are idempotent —
 * matches existing folders by slug suffix, renames to keep order tidy.
 *
 * Usage:
 *   php scripts/seed-press.php
 *   php scripts/seed-press.php --dry-run
 */

require __DIR__ . '/../kirby/bootstrap.php';

const PRESS_DIR = __DIR__ . '/../content/7_press';

$dryRun = in_array('--dry-run', array_slice($argv, 1), true);

$articles = [

    // ─── 2025 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'santa-claus-came-to-town',
        'title' => 'Santa Claus came to town',
        'excerpt' => 'More than 2700 people came to see the "Kiwi Kirihimete Adventure" across three performances — a record crowd for the Christmas Show\'s 19th year.',
        'body' => <<<MD
Queenstown Christmas Show performers including Ivy Sim, 11, Ryder Wallace, 9, Santa Claus (Marc Hamilton) and Mrs Claus (Dana Hamilton) were among the 100 performers to entertain record crowds at the annual show at the Queenstown Events Centre over the weekend.

More than 2700 people came to see the *"Kiwi Kirihimete Adventure"* with three performances at the weekend, one on Saturday and two on Sunday.

Among the talent performing in the show's 19th year were the Queenstown Gymnastics Club, Turn Up The Music's junior choir, Silk and Circus, kapa haka school groups, the Wakatipu Conservatoire of Classical Ballet and the Remarkable Men's Ballet.

Queenstown Lakes District Council arts and events relationship manager Jan Maxwell said she was *"thrilled"* the show could be produced for local families at such a special time of year.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/santa-claus-came-town',
        'author' => 'Guy Williams',
        'publishedDate' => '2025-12-08',
        'tags' => 'community, events, queenstown',
        'featured' => false,
    ],

    [
        'slug' => 'christmas-shows-now-a-triple-treat',
        'title' => 'Christmas Show\'s now a triple treat',
        'excerpt' => 'Demand from previous years pushes the long-running Christmas Show from two performances to three. Kiwi Kirihimete Adventure runs at the Events Centre on December 6 and 7.',
        'body' => <<<MD
Catering to demand, Queenstown's long-running Christmas Show is extending from two performances to three.

Tickets for *Kiwi Kirihimete Adventure* — showing at the Events Centre on December 6 at 3pm and December 7 at 1pm and 5pm — go on sale at 9am today.

Prices remain \$10 for adults, \$5 for children and free for under-5s.

Ticket buyers can also buy partial or full Christmas hampers — from \$20 for nibbles to \$97 for meals feeding up to 10 — which the Queenstown Salvation Army will prepare and deliver to local families in need.

This year's show, which again showcases young local talent, combines dance, music, gymnastics and aerial performance.

With more than 100 performers and crew, under director Tiffany Bindon, choreographer Anna Stuart and music director Sofia Taquet, *Kiwi Kirihimete Adventure* sets out to discover what a summer Christmas in Queenstown looks like.

Also appearing on stage are Silk & Circus Aerialists, Queenstown Gymnastics Club, Wakatipu Conservatoire of Classical Ballet, Turn Up the Music Children's Choir and, of course, the hilarious Remarkables Men's Ballet.

Tickets can be bought via [christmasshow.co.nz](https://christmasshow.co.nz) or Humanitix.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/christmas-show%E2%80%99s-now-triple-treat',
        'author' => 'Philip Chandler',
        'publishedDate' => '2025-11-06',
        'tags' => 'preview, tickets, queenstown, christmas',
        'featured' => true,
    ],

    [
        'slug' => 'festival-head-turners',
        'title' => 'Festival head-turners',
        'excerpt' => 'An Arrowtown Autumn Festival first — the Remarkable Men\'s Ballet take the stage outside the Christmas Show for the first time, performing Vivaldi\'s Autumn at the 39th festival.',
        'body' => <<<MD
It's an Arrowtown Autumn Festival first. Now in its 39th year, this year's festival — which starts today — will feature six highly-skilled (according to them) local dancers who are hell-bent on bringing the entertainment value.

The Remarkable Men's Ballet troupe, traditionally only trotted out at the annual Queenstown Christmas Show, have this year been invited to perform — in their much-loved tutus — at today's Super Seniors High Tea, in the Athenaeum Hall, and as part of the lunchtime entertainment on the Buckingham Green tomorrow, between 1 and 3pm.

Additionally, they'll take part in Saturday's street parade, which starts at 2pm.

Autumn festival co-ordinator Vanessa Williams says she *"cannot wait"* to see the burly ballet boys in full flight, performing a routine, fittingly set to Vivaldi's *Autumn*, choreographed by Claire Hazledine.

Balletman Uan Spijkerbosch is full of confidence ahead of their special performances. *"We think we've got it. It's solid, it's dynamic, and we've nailed it."*
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/festival-head-turners',
        'author' => 'Tracey Roxburgh',
        'publishedDate' => '2025-04-24',
        'tags' => 'preview, arrowtown, autumn festival, milestone',
        'featured' => true,
    ],

    // ─── 2024 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'mens-ballet-tutu-much',
        'title' => 'Men\'s ballet tutu much',
        'excerpt' => 'The Remarkable Men\'s Ballet returns for the Queenstown Christmas Show with a new lineup and fresh costumes — performing as presents rather than in their traditional tutus.',
        'body' => <<<MD
The Remarkable Men's Ballet will entertain audiences at the Queenstown Events Centre this weekend as part of the Christmas Show, with performances scheduled for 1pm and 5pm on Sunday.

The nine-strong troupe features two new members this year: volunteer firefighter Jake Neaves and Peter Laurenson, husband of former mayor Vanessa van Uden. Craig 'Ferg' Ferguson leads the group.

Ferguson notes the troupe will perform a shorter piece this year, describing it as *"a good game's a quick game."* The performers will be dressed as presents rather than wearing their signature tutus. Ferguson acknowledged the tutu absence is "still a bit of a sore point" but emphasised the group remains committed to entertaining audiences.

He stressed their primary goal remains entertaining younger audience members and families. *"We're not going be perfect — we strive to be perfect, but that's never going to happen,"* Ferguson said.

Due to ongoing roadworks on Ballarat Street, the group's traditional flashmob location has been relocated. Instead of performing at their usual Friday spot, the ensemble will perform at Earnslaw Park around 6pm tomorrow.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/men%E2%80%99s-ballet-tutu-much',
        'author' => 'Tracey Roxburgh',
        'publishedDate' => '2024-12-07',
        'tags' => 'feature, queenstown, christmas, costumes',
        'featured' => true,
    ],

    [
        'slug' => 'what-a-show',
        'title' => 'What a show!',
        'excerpt' => 'Two sold-out performances of "A World of Christmas" at the Queenstown Events Centre — featuring the ever-popular Remarkable Men\'s Ballet and 27 young performers.',
        'body' => <<<MD
Queenstown's annual Christmas extravaganza took place at the Events Centre on Sunday with two sold-out performances.

The show, titled *"A World of Christmas"*, featured 16 actors and 11 dancers (ages 9–14) exploring Christmas traditions across cultures. The production included performances from Queenstown Gymnastics Club, Silk and Circus, and the Wakatipu Conservatoire of Classical Ballet. The article notes that *"the ever-popular The Remarkable Men's Ballet"* also performed.

The event was directed by Tiffany Bindon, with choreography by Anna Stuart and music direction by Sofia Taquet. Jan Maxwell served as producer and costume coordinator. Santa made a special appearance.

The show, presented by Queenstown Lakes District Council, raised funds for the Salvation Army Queenstown through ticket sales and donations.
MD,
        'sourceName' => 'Lakes Weekly Bulletin',
        'sourceUrl' => 'https://lwb.co.nz/content/what-a-show/',
        'author' => 'QMG Media',
        'publishedDate' => '2024-12-09',
        'tags' => 'review, queenstown, christmas',
        'featured' => false,
    ],

    [
        'slug' => 'vanessa-van-uden-profile',
        'title' => 'Vanessa van Uden: From managing the money to mayoral motorcade showdowns…',
        'excerpt' => 'A long-form profile of former Queenstown Lakes Mayor Vanessa van Uden — including the moment she performed "I Will Survive" with the Remarkable Men\'s Ballet in 2016.',
        'body' => <<<MD
Vanessa van Uden grew up on a farm near Te Anau, daughter of a Dutch immigrant who arrived in 1952 with minimal resources. Her father's emphasis on education and determination shaped her approach to life. She attended Mararoa primary school before boarding at St Hilda's in Dunedin, where she met her future husband Pete Laurenson.

After earning a commerce degree from Otago University, she worked as an accountant at Cadbury's in Dunedin, rising to factory accountant by age 24. She married Pete the day after her 22nd birthday in 1989. At 26, she became administration manager at Southland Boys' High, implementing financial controls.

Following a life-threatening medical emergency in 1994, she balanced motherhood with further studies while Pete worked in Auckland. In the late 1990s, she joined Queenstown Lakes District Council as contracts manager, later establishing her own consultancy. She was elected district councillor in 2007 and served as mayor from **2010 to 2016**, becoming the district's first female mayor at 43.

Her mayoral tenure included managing airport-share controversies and various diplomatic engagements. She received the ONZM distinction in 2017 and currently chairs multiple trusts and community organisations.

The piece features a memorable caption: Mayor Vanessa *"performing 'I Will Survive' with the Men's Ballet in 2016"* — during her mayoral duties, and the year her husband Pete would later join the troupe properly (2024).
MD,
        'sourceName' => 'Lakes Weekly Bulletin',
        'sourceUrl' => 'https://lwb.co.nz/content/vanessa-van-uden-from-managing-the-money-to-mayoral-motorcade-showdowns/',
        'author' => 'Sue Fea',
        'publishedDate' => '2024-01-08',
        'tags' => 'profile, mayors, history',
        'featured' => false,
    ],

    // ─── 2023 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'embracing-shows-theme',
        'title' => 'Embracing show\'s theme',
        'excerpt' => 'The annual Queenstown Christmas Show returns with *Not a Creature Was Stirring*, centred on Murray the Mouse — Ferg admits "general disappointment that we won\'t be in our beloved tutus".',
        'body' => <<<MD
Despite its name, creatures will definitely be stirring in Queenstown this Sunday.

The annual Christmas show, supported by Queenstown's council, will be performed at the Queenstown Events Centre at 1pm and 5pm.

Written by Queenstown performer Margaret O'Hanlon, *Not a Creature Was Stirring (Not Even a Mouse)* centres around Murray the Mouse (Arka Huck), who's troubled because Santa never brings gifts for mice.

This year's show features about 60 locals — the majority of them youngsters — performing a mix of popular songs and carols, along with performances by Queenstown Gymnastics Club, Silk & Circus, Wakatipu Conservatoire of Classical Ballet, Dance Evolution Studio and the Remarkable Men's Ballet.

Head "mincer" Craig 'Ferg' Ferguson's keeping mum about the theme of this year's performance, though confirms there's *"general disappointment that we won't be in our beloved tutus for the show".*

*"There's been the odd tear shed, expletives, but we've managed to get through that, I think, and we just look forward to presenting what we present on Sunday … miaow."*

However, he confirms people near the Athol St–Ballarat St intersection about 6pm tomorrow may also get a sneak peek of Sunday's performance.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/embracing-show%E2%80%99s-theme',
        'author' => 'Tracey Roxburgh',
        'publishedDate' => '2023-12-08',
        'tags' => 'preview, queenstown, christmas',
        'featured' => false,
    ],

    // ─── 2022 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'christmas-show-audience-reaction',
        'title' => 'Christmas show draws plenty of audience reaction',
        'excerpt' => 'The 16th annual Queenstown Christmas Show welcomed about 2,400 people across two sessions — the event\'s largest audience at the Queenstown Events Centre.',
        'body' => <<<MD
Shouts, gasps, wolf whistles and a sprinkling of Santa hats made for an energetic Queenstown Christmas show yesterday afternoon.

After temporarily moving online in 2021, the 16th annual performance welcomed about 2400 people to the Queenstown Events Centre over two sessions, the show's most attended at the QEC.

*The 12 Bells of Christmas* followed five children as they explored Queenstown to find their granny's 12 missing bells and restore her holiday tradition.

The show featured a range of local acts including the popular Remarkable Men's Ballet who *"enchanted the crowd and earned themselves perhaps the loudest chorus of cheers (and good-hearted wolf whistles) from parents."*
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/christmas-show-draws-plenty-audience-reaction',
        'author' => 'Otago Daily Times',
        'publishedDate' => '2022-12-12',
        'tags' => 'review, queenstown, christmas, community',
        'featured' => false,
    ],

    // ─── 2020 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'thousands-enjoy-santa-on-stage',
        'title' => 'Thousands enjoy Santa on stage at Christmas show',
        'excerpt' => 'Father Christmas leads the cast — 2,400 people across two matinees, including performances from the Remarkable Men\'s Ballet.',
        'body' => <<<MD
Father Christmas leads the cast of Queenstown's Christmas Show in song at the Events Centre.

In total, 2400 people reserved seats for the 1pm and 4pm matinees that included performances from Queenstown School of Dance, Wakatipu Conservatoire of Classical Ballet, Remarkable Men's Ballet, Silk and Circus, and the Queenstown Gymnastics Club.

Queenstown Lakes District Council relationship manager for arts and events Jan Maxwell said *"it was amazing to see so many faces after a testing year."* She noted the council made the show free, though donations for the Salvation Army were accepted.

The narrative centred on Aroha introducing an Icelandic visitor named Olaf to a traditional Kiwi Christmas, with assistance from various characters including Rudolph, a hotelier, Mrs Claus, Farmer Jo, and a dog.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown/thousands-enjoy-santa-stage-christmas-show',
        'author' => 'Matthew Mckew',
        'publishedDate' => '2020-12-14',
        'tags' => 'review, queenstown, christmas, covid-era',
        'featured' => false,
    ],

    // ─── 2013 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'remarkable-ballet-steals-show',
        'title' => 'Remarkable ballet steals the show',
        'excerpt' => 'Pointed toes, puffed tutus, red lipstick, hairy legs and a rugby ball — the Remarkable Men\'s Ballet bring tip-toed walks and twinkling fingers to the Shotover Christmas Cracker.',
        'body' => <<<MD
Pointed toes, puffed tutus, red lipstick, hairy legs and a rugby ball.

It wasn't just talent people abandoned their picnic rugs to see when they rushed to the front of the stage to watch a certain men's ballet group close up.

The Remarkable Men's Ballet finally brought their tip-toed walks and twinkling fingers to the stage towards the end of the Shotover Christmas Cracker in Queenstown on Saturday.

Earlier, younger and perhaps more experienced ballet dancers had set the bar high but the men, who had been invited to join this year's cast and had been practising hard, showed no signs of stage fright.

Winners of the wishing tree competition, in which children had written a wish and placed it on one of the dedicated trees at locations such as schools and Santa's grotto in Athol St, were announced on stage.

One of the winning wishes involved nine separate wishes from friends of children whose family in Queenstown had sent their savings to relatives in the Philippines after a typhoon caused massive destruction. The family received money to help buy a new car.

The talent from hundreds of performers came in many forms, from a seemingly endless supply of singers to dancing Christmas trees and a hip-hop dance crew.

Saturday's show was the largest in the event's seven-year history and the first time it had been held outdoors at the Queenstown Recreation Ground, which had allowed for a fireworks finale.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/remarkable-ballet-steals-show',
        'author' => 'Christina McDonald',
        'publishedDate' => '2013-12-17',
        'tags' => 'review, christmas cracker, history',
        'featured' => true,
    ],

    [
        'slug' => 'break-a-leg',
        'title' => 'Break a leg!',
        'excerpt' => 'A 2013 dress-rehearsal preview of the Shotover Christmas Cracker — 150 cast members, first outdoor edition at the Queenstown Recreation Ground.',
        'body' => <<<MD
The 2013 Remarkable Men's Ballet group, featuring dancers that change annually, represents a cherished component of the Shotover Christmas Cracker — previously called the Christmas Spectacular. These performers comprise approximately 150 total participants in the production.

A dress rehearsal the evening prior demonstrated the dancers' considerable preparation, showcasing intricate choreography and athletic leg work.

The seventh iteration of this event marked a significant milestone: it would be held outdoors for the inaugural time, taking place at the Queenstown Recreation Ground. The show commenced at 6 p.m.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/break-leg',
        'author' => 'Christina McDonald',
        'publishedDate' => '2013-12-15',
        'tags' => 'preview, christmas cracker',
        'featured' => false,
    ],

    // ─── 2011 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'meet-the-lords-of-the-dance',
        'title' => 'Meet the lords of the dance...',
        'excerpt' => 'James Beech\'s first-person account of joining the Remarkable Men\'s Ballet for the 2011 Christmas Spectacular — the article that gave us the entire 2011 lineup.',
        'body' => <<<MD
If the good people of Queenstown feel the earth shaking over the next few weeks, they need not dive under the nearest table. Chances are it will be a dozen sturdy blokes performing an especially energetic grand jeté in unison.

Ballet is a beautiful, graceful and precise form of physical and artistic expression which has enthralled the world for five centuries. However, Wakatipu residents will get to witness the dance in its purest and most dazzling interpretation when the Remarkable Mens' Ballet Troupe takes the stage as part of the 2011 Shotover Jet Christmas Spectacular on December 11.

A gleeful Tracey Roxburgh, a ballerina for 10 years, *"volunteered"* this reporter for the comical highlight of the spectacular when compere without compare Simon Green was short of bodies.

We lords of the dance gathered for our first and second rehearsals in the Queenstown Primary School Hall last week. (Out of class hours — the children will be traumatised enough during the show.) Some members make their encore this year, but I was among the newcomers who threw themselves on the mercy of Queenstown School of Dance co-founder Anna Stuart, back for a second year.

Shoes and socks off, the spirit of fun and a feeling of ridiculousness ran as rampant as we did while our teacher instructed us on the delicate techniques we will perform, in full costume and make-up, to the waltzing strains from *The Nutcracker*.

Respect for real ballet dancers has increased 10-fold, given the multitude of moves and timings we have to remember while running, jumping and flouncing around with our imaginary harps and bouquets.

Yet no-one wants to let the side down and everyone wants to nail the sequence to deliver the best and funniest performance.

**2011 troupe:** Graeme Jackson, Rowan McDonald, Craig Ferguson, Andrew Bisset, "Tall Paul", Henry Youngman, Chris Dagg, JD Marrable, Irik Anderson, Tony Moore, Darren Craig, and the author.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/meet-lords-dance',
        'author' => 'James Beech',
        'publishedDate' => '2011-11-29',
        'tags' => 'feature, history, 2011 lineup, first-person',
        'featured' => true,
    ],

    [
        'slug' => 'these-lissom-lads',
        'title' => 'These lissom lads are agile, swanlike; epitome of grace',
        'excerpt' => 'A second instalment from James Beech\'s embedded account of the 2011 RMB rehearsals — duct tape, Anna Stuart\'s patience, and hoisting Rowan McDonald mid-routine.',
        'body' => <<<MD
The absurdity of our ballet boot camp has become almost like a perfectly normal and fun exercise routine, but we are now on the downward spiral to the Remarkable Men's Ballet performance on Sunday and the pressure is on.

We tried on our costumes for the first time after rehearsal on Tuesday. Duct tape will be needed at the back of mine while I'm flouncing around otherwise our show will instantly go from ballet to burlesque.

One never fully appreciates the cool, crisp alpine air of Queenstown until one wears not much other than skimpy material which looks like it was ripped from a curtain rail.

Sections of the sequence are locked and loaded into our memory banks and we bolt the sections together towards the end, which works pretty well.

Some parts are straightforward, such as when we're merrily bouncing around like newborn lambs, or waltzing "freestyle". But others are as mentally challenging as patting your head and rubbing your stomach at the same time while moving en masse to cues in the music.

However, suddenly dropping to the floor on one knee like an anvil could be considered dangerous to our health. None of us mend quite as quickly as we used to, but we suffer for our art.

There is always some trepidation when Queenstown School of Dance co-founder Anna Stuart throws in a new section to learn and one of the latest involved manhandling the nearest dancer. Rowan McDonald is the lucky chap who gets to be hoisted in midair by Craig Ferguson and me and hopefully not dropped on the front row of the audience.

Anna has the patience of a saint and has only buried her face in her hands once.

*"What happened to my quiet little fairies,"* she asked when we waltzed towards her like a herd of crazed elephants.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/these-lissom-lads-are-agile-swanlike-epitome-grace',
        'author' => 'James Beech',
        'publishedDate' => '2011-12-10',
        'tags' => 'feature, history, 2011 lineup, first-person',
        'featured' => false,
    ],

    [
        'slug' => 'amazing-grace-at-christmas-show',
        'title' => 'Amazing grace at Christmas show',
        'excerpt' => 'The 2011 show featured a cameo from Mayor Vanessa van Uden — she stole the men\'s flowers and was wrapped in tinsel and carried offstage by the "ballerinas".',
        'body' => <<<MD
The Remarkables Men's Ballet troupe performed their Nutcracker-inspired sequence at the 2011 Shotover Jet Christmas Spectacular at the Queenstown Events Centre.

The performance included a cameo from Queenstown Lakes Mayor Vanessa van Uden, who *"after stealing the men's flowers, was wrapped in tinsel and carried from the stage by several 'ballerinas'."*
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/amazing-grace-christmas-show',
        'author' => 'Joe Dodgshun',
        'publishedDate' => '2011-12-12',
        'tags' => 'review, mayoral cameo, 2011',
        'featured' => false,
    ],

    [
        'slug' => 'shotover-jet-spectacular-casting-call',
        'title' => 'Shotover Jet Christmas Spectacular casting call',
        'excerpt' => '"More-the-merrier approach" — show director Simon Green opens up applications for the 2011 Christmas Spectacular, with the Remarkable Men\'s Ballet among the named acts being sought.',
        'body' => <<<MD
The 2011 Shotover Jet Christmas Spectacular, scheduled for December 11, is actively recruiting performers.

Show director Simon Green announced that *"applications were open for anyone interested in being part of Queenstown's biggest annual concert."*

The previous year's production featured over 150 cast members. Organisers seek a core ensemble of singers and dancers, a children's ensemble, dedicated dancers including the Remarkable Men's Ballet, and independent performance groups such as choirs, dance troupes, and musical theatre-cabaret entertainers.

Green noted enthusiasm for involvement: *"We've got a great line-up of local talent already, but are sticking to the more-the-merrier approach."*

Margaret O'Hanlon serves as musical director, with Anna Stuart handling choreography. Rehearsals begin in early November.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/shotover-jet-christmas-spectacular-casting-call',
        'author' => 'Tracey Roxburgh',
        'publishedDate' => '2011-09-23',
        'tags' => 'casting call, history',
        'featured' => false,
    ],

    // ─── 2010 ────────────────────────────────────────────────────────────────
    [
        'slug' => 'dream-team-organising-spectacular',
        'title' => '"Dream team" organising Christmas spectacular',
        'excerpt' => 'Concert director Simon Green, Margaret O\'Hanlon and Anna Stuart form a "creative dream team" for the 2010 Shotover Jet Christmas Spectacular — entering its fourth year.',
        'body' => <<<MD
The Shotover Jet Remarkable Christmas Spectacular, entering its fourth year, will take place December 12 at the Queenstown Events Centre.

Concert director Simon Green has partnered with Margaret O'Hanlon and Anna Stuart to form a *"creative dream team"* organising the 2010 event. The show features over 150 local performers including the Queenstown Community Choir, Screaming Banshees, Sequin Sisters, and X-It Battle winners The Fletcherz.

Featured soloists include Emily Burns, Molly Devine, Marc Hamilton, Sam Hillman, Andrea Cruikshank, plus Anita Haira.

The cast also includes the Remarkable Christmas Ensemble, a children's choir, 60+ dancers from Queenstown School of Dance, and **the Remarkables Christmas Male Ballet Company** — *who performed at the 2009 concert with then-mayor Clive Geddes.*

The production is supported by Queenstown Lakes District Council with sponsorship from Shotover Jet, Hoamz (MREINZ), Remarkables Park Town Centre, Lakes Leisure, and Mediaworks.
MD,
        'sourceName' => 'Otago Daily Times',
        'sourceUrl' => 'https://www.odt.co.nz/regions/queenstown-lakes/dream-team-organising-christmas-spectacular',
        'author' => 'Tracey Roxburgh',
        'publishedDate' => '2010-11-17',
        'tags' => 'preview, history, founding-era',
        'featured' => true,
    ],
];

// ─── Generate ────────────────────────────────────────────────────────────────

function field(string $key, $value): string {
    if (is_bool($value)) $value = $value ? 'true' : 'false';
    $value = (string) $value;
    if (str_contains($value, "\n")) {
        return ucfirst($key) . ":\n\n" . $value;
    }
    return ucfirst($key) . ": " . $value;
}

if (!is_dir(PRESS_DIR)) mkdir(PRESS_DIR, 0755, true);

// First pass: rename existing folders to temp names so we can re-prefix cleanly
if (!$dryRun) {
    foreach ($articles as $a) {
        $existing = glob(PRESS_DIR . '/*_' . $a['slug']);
        if ($existing) {
            $tmp = PRESS_DIR . '/__seed_tmp_' . $a['slug'];
            if ($existing[0] !== $tmp) rename($existing[0], $tmp);
        }
    }
}

$created = 0; $updated = 0; $renamed = 0;

foreach ($articles as $i => $a) {
    $prefix = $i + 1;
    $desired = PRESS_DIR . '/' . $prefix . '_' . $a['slug'];
    $tmp = PRESS_DIR . '/__seed_tmp_' . $a['slug'];

    if ($dryRun) {
        $action = is_dir($tmp) ? 'rename+update' : (glob(PRESS_DIR . '/*_' . $a['slug']) ? 'update' : 'create');
        echo "  would {$action} {$prefix}_{$a['slug']}\n";
        continue;
    }

    if (is_dir($tmp)) {
        if ($tmp !== $desired) { rename($tmp, $desired); $renamed++; }
        $action = 'update';
    } elseif (is_dir($desired)) {
        $action = 'update';
    } else {
        mkdir($desired, 0755, true);
        $action = 'create';
    }

    $parts = [
        field('title',         $a['title']),
        field('excerpt',       $a['excerpt']),
        field('body',          $a['body']),
        field('sourcename',    $a['sourceName']),
        field('sourceurl',     $a['sourceUrl']),
        field('author',        $a['author']),
        field('publisheddate', $a['publishedDate']),
        field('featured',      $a['featured']),
        field('tags',          $a['tags']),
        field('mentionedperformers', ''),
    ];

    file_put_contents($desired . '/press-article.txt', implode("\n\n----\n\n", $parts) . "\n");

    if ($action === 'create') $created++; else $updated++;
    echo "  ✓ {$prefix}_{$a['slug']} ({$action})\n";
}

echo str_repeat('-', 60) . "\n";
echo "Created: {$created}  Updated: {$updated}  Renamed: {$renamed}  Total: " . count($articles) . "\n";
