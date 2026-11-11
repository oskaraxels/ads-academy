# SOURCES

Every source used in the playground, what was taken from it, and which tasks cite it. Link status is re-checked by `tests/test_site.py` (see `tests/link-status-*.json`).

Evidence labels: PROVEN TEST (real A/B with known winner) · LONG-RUNNING SIGNAL · PUBLISHED CASE STUDY / BENCHMARK (reported, often correlational) · Teaching example (written for practice, no metrics) · PRINCIPLE LESSON (cited).

## Upworthy Research Archive (Matias, Munger, Aubin Le Quere, Ebersole), exploratory dataset on OSF
- URL: [https://osf.io/jd64p/](https://osf.io/jd64p/)
- Taken: Exploratory packages CSV (osf.io/download/3vqmp). We selected 54 tests where two packages shared the same image (eyecatcher_id) and differed in headline, both ≥2,000 impressions, our two-proportion z>3.5 and relative CTR lift >50%; filtered out sensitive/political topics. Headlines quoted verbatim (short); CTRs computed from impressions/clicks.
- Cited by 85 task(s): t2-1-01, t2-1-02, t2-1-03, t2-1-04, t2-1-05, t2-1-06, t2-1-07, t2-1-08, t2-1-09, t2-1-10, t2-1-11, t2-1-12, t2-1-13, t2-1-14, t2-1-15, t2-2-01, t2-2-02, t2-2-03, t2-2-04, t2-2-05, t2-2-06, t2-2-07, t2-2-08, t2-2-09, t2-2-10, t2-2-11, t2-2-12, t2-2-13, t2-2-14, t2-2-15, t2-3-01, t2-3-02, t2-3-03, t2-3-04, t2-3-05, t2-3-06, t2-3-07, t2-3-08, t2-3-09, t2-3-10 …

## Upworthy Research Archive site
- URL: [https://upworthy.natematias.com/](https://upworthy.natematias.com/)
- Taken: Background on the archive; cited for the 'clarity beats cleverness' pattern seen in the data.
- Cited by 1 task(s): t2-4-13
- Principle chips linking here: Clarity beats cleverness, Too clever / pun-driven = unclear, Concrete, picturable words

## Dan Siroker, 'How Obama Raised $60 Million by Running a Simple Experiment'
- URL: [https://medium.com/siroker/how-obama-raised-60-million-by-running-a-simple-experiment-e2e29b41bade](https://medium.com/siroker/how-obama-raised-60-million-by-running-a-simple-experiment-e2e29b41bade)
- Taken: 2008 splash-page test: 24 combos, 310,382 visitors, 8.26%→11.6% (+40.6%), all videos lost to all images.
- Cited by 1 task(s): t3-1-01

## WIRED, 'The A/B Test: Inside the technology that's changing the rules of business'
- URL: [https://www.wired.com/story/the-ab-test/](https://www.wired.com/story/the-ab-test/)
- Taken: 'Learn More' +18.6% vs 'Sign Up'; family photo +13.1%.
- Cited by 1 task(s): t3-1-02

## WIRED, 'Annoying Emails Work Way Better Than You'd Think: A Lesson From the Obama Campaign'
- URL: [https://www.wired.com/2013/06/dont-dismiss-email-a-case-study-from-the-obama-campaign/](https://www.wired.com/2013/06/dont-dismiss-email-a-case-study-from-the-obama-campaign/)
- Taken: 'I will be outspent' subject line won among 13 tested; raised ~$2.6M in one day; other tested subject lines.
- Cited by 1 task(s): t5-1-01

## Sallis et al., organ donor registration RCT with 1,085,322 GOV.UK users (BMC/PMC)
- URL: [https://pmc.ncbi.nlm.nih.gov/articles/PMC6150960/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6150960/)
- Taken: Peer-reviewed RCT table of 8 messages; reciprocity 4,256 vs control 3,085 sign-ups (OR 1.38); social-norm+image arm worse than control (OR 0.94).
- Cited by 3 task(s): t3-1-10, t3-2-08, t4-1-01
- Principle chips linking here: Social proof (use carefully)

## Behavioural Insights Team, 'Increasing organ donor registration'
- URL: [https://www.bi.team/articles/increasing-donor-organ-registration/](https://www.bi.team/articles/increasing-donor-organ-registration/)
- Taken: BIT summary: reciprocity +38% / ~96,000 extra registrations; reciprocity vs loss frame not significantly different.
- Cited by 1 task(s): t4-1-02
- Principle chips linking here: Reciprocity & fairness framing (BIT)

## Jason Fried, 'Writing Decisions: Headline tests on the Highrise signup page' (Signal v. Noise)
- URL: [https://signalvnoise.com/posts/1525-writing-decisions-headline-tests-on-the-highrise-signup-page](https://signalvnoise.com/posts/1525-writing-decisions-headline-tests-on-the-highrise-signup-page)
- Taken: 5 headline/subhead variants; '30-day Free Trial on All Accounts' +30%, testimonial subhead +7%.
- Cited by 3 task(s): t4-1-03, t4-1-04, t4-3-07
- Principle chips linking here: Lower risk: free trial, guarantee (Hormozi, Highrise test)

## Michael Aagaard, 'How to Design Call to Action Buttons that Convert' (Unbounce)
- URL: [https://unbounce.com/conversion-rate-optimization/design-call-to-action-buttons/](https://unbounce.com/conversion-rate-optimization/design-call-to-action-buttons/)
- Taken: 'Start my free 30 day trial' vs 'your' → +90% CTR.
- Cited by 3 task(s): t2-4-06, t4-1-05, t9-2-04
- Principle chips linking here: One clear call to action

## CXL, 'A/B Testing: 5 A/B Tests For Your Landing Page Opt-In Forms'
- URL: [https://cxl.com/blog/ab-testing-forms/](https://cxl.com/blog/ab-testing-forms/)
- Taken: Empire Flippers 'Join us!' vs 'Make Money Flipping Websites' +33.1%.
- Cited by 1 task(s): t4-1-06

## Kohavi & Thomke, 'The Surprising Power of Online Experiments' (HBR, 2017)
- URL: [https://hbr.org/2017/09/the-surprising-power-of-online-experiments](https://hbr.org/2017/09/the-surprising-power-of-online-experiments)
- Taken: Bing 2012 ad-title change → +12% revenue (>$100M/yr US).
- Cited by 1 task(s): t4-1-08

## Wikipedia: Sherwin Cody (cites Victor Schwab's 10-year headline comparison)
- URL: [https://en.wikipedia.org/wiki/Sherwin_Cody](https://en.wikipedia.org/wiki/Sherwin_Cody)
- Taken: Sackheim/Cody ad ran 40+ years; Schwab's 10-year comparison ~3x response vs 'How to Speak and Write Masterly English'.
- Cited by 1 task(s): t4-1-07

## NEH Humanities, interview with Edwin Battistella on Sherwin Cody
- URL: [https://www.neh.gov/humanities/2010/marchapril/iq/impertinent-questions-edwin-l-battistella](https://www.neh.gov/humanities/2010/marchapril/iq/impertinent-questions-edwin-l-battistella)
- Taken: Ad placed in hundreds of publications; 15 minutes a day; free booklet.
- Cited by 2 task(s): t4-3-01, t4-3-06

## AdEspresso, 'Image vs. Video vs. Carousel: Which is the Best Facebook Ad Format? (a $1,000 Experiment)'
- URL: [https://adespresso.com/blog/best-facebook-ad-format-experiment/](https://adespresso.com/blog/best-facebook-ad-format-experiment/)
- Taken: $1,000 test: image vs slideshow video vs carousel CPL; predictions favoured video.
- Cited by 3 task(s): t3-1-03, t3-1-04, t3-2-05

## AdEspresso, 'Facebook Video Thumbnail: Is it Essential...? (a $1,000 Experiment)'
- URL: [https://adespresso.com/blog/facebook-video-thumbnail-impact-experiment/](https://adespresso.com/blog/facebook-video-thumbnail-impact-experiment/)
- Taken: Thumbnail test (photo of presenter $25.02 vs cartoon $49.87 CPI) + Wistia $1k/$10k/$100k video CPIs.
- Cited by 4 task(s): t3-1-05, t3-1-06, t3-2-01, t3-2-11
- Principle chips linking here: Human face / eye contact draws attention

## Meta for Business, 'Capture Attention with Updated Features for Video Ads'
- URL: [https://www.facebook.com/business/news/updated-features-for-video-ads](https://www.facebook.com/business/news/updated-features-for-video-ads)
- Taken: Up to 47% of video value in first 3 seconds, 74% in first 10 (Meta/Nielsen); captions +12% view time; 41% of videos meaningless without sound.
- Cited by 11 task(s): t1-3-02, t1-3-08, t3-1-07, t3-2-07, t3-3-01, t3-3-03, t3-3-08, t3-3-11, t3-3-12, t9-1-05, t9-1-06
- Principle chips linking here: 3-second hook (Meta: up to 47% of video value in first 3s), Design for sound-off: captions & visual message

## Facebook IQ, 'Capturing Attention in Feed: The Science Behind Effective Video Creative' (2016)
- URL: [https://www.facebook.com/business/news/insights/capturing-attention-feed-video-creative](https://www.facebook.com/business/news/insights/capturing-attention-feed-video-creative)
- Taken: 2016 Facebook IQ study of 850+ video ads (creative elements vs ad recall); used for contrast/brand-early/sound-off guidance.
- Cited by 6 task(s): t3-2-02, t3-2-03, t3-2-10, t3-2-12, t3-2-13, t3-2-14
- Principle chips linking here: Contrast & single focal point (thumb-stop)

## Meta for Business success story: Standard Foods (Reels A/B test)
- URL: [https://www.facebook.com/business/success/standard-foods](https://www.facebook.com/business/success/standard-foods)
- Taken: Meta case study: Reels following creative essentials → 36% lower CPC, 34% lower cost per LPV, 2.9x CTR (reported).
- Cited by 1 task(s): t3-1-08

## Meta for Government & Nonprofits: Cancer Research UK case study
- URL: [https://www.facebook.com/government-nonprofits/case-studies/2024-05-21-cancer-research-uk](https://www.facebook.com/government-nonprofits/case-studies/2024-05-21-cancer-research-uk)
- Taken: Meta case study: Reels-first A/B → 10,000 more reach, 2% more conversions, lower CPA (reported).
- Cited by 1 task(s): t3-1-09

## Meta for Business, 'The Creative Advantage: Unlocking the Power of Diversification with Meta Andromeda'
- URL: [https://www.facebook.com/business/news/the-creative-advantage-unlocking-the-power-of-diversification-with-meta-andromeda](https://www.facebook.com/business/news/the-creative-advantage-unlocking-the-power-of-diversification-with-meta-andromeda)
- Taken: Meta's statement that focus shifted from niche targeting to creative diversification; Advantage+ notes.
- Cited by 7 task(s): t1-3-03, t1-3-07, t3-3-10, t6-1-06, t7-1-11, t7-4-04, t12-1-03
- Principle chips linking here: Creative is targeting: diversify concepts (Andromeda)

## Meta Transparency Center, Advertising Standards: Health and Wellness
- URL: [https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/)
- Taken: Health & Wellness ad standard: 18+ targeting; no statements of inferiority about appearance; no pinched-fat close-ups.
- Cited by 19 task(s): t1-3-04, t2-4-03, t2-4-04, t2-4-09, t2-4-12, t2-4-15, t3-2-06, t3-2-15, t3-3-05, t6-1-05, t6-2-11, t6-2-15, t7-1-01, t7-1-03, t7-1-04, t7-1-05, t7-1-08, t7-4-01, t8-1-07
- Principle chips linking here: Meta health policy: no negative self-perception, no unqualified timed promises

## Meta Ad Library
- URL: [https://www.facebook.com/ads/library/](https://www.facebook.com/ads/library/)
- Taken: Ad Library entry point; field exercises link to keyword searches (country=SE). No performance data is shown for non-political ads.
- Cited by 7 task(s): t6-1-01, t6-1-02, t6-1-03, t6-1-04, t12-1-01, t12-1-02, t12-1-06

## Gong Labs, 'Surprising cold email CTA that increases meeting bookings' (304,174 emails)
- URL: [https://www.gong.io/blog/this-surprising-cold-email-cta-will-help-you-book-a-lot-more-meetings](https://www.gong.io/blog/this-surprising-cold-email-cta-will-help-you-book-a-lot-more-meetings)
- Taken: 304,174 emails; Interest CTA highest-performing for cold; specific-time CTA 15% cold → 37% in-deal.
- Cited by 15 task(s): t1-3-05, t5-2-13, t5-3-01, t5-3-02, t5-3-06, t5-4-01, t5-4-03, t6-2-12, t7-3-02, t7-3-04, t7-3-06, t7-4-03, t8-2-02, t8-3-02, t12-1-04
- Principle chips linking here: Interest-based CTA for cold email (Gong)

## Gong, '7 cold email statistics that can refine your engagement strategy'
- URL: [https://www.gong.io/blog/cold-email-stats](https://www.gong.io/blog/cold-email-stats)
- Taken: Longer (30–150 words) emails better; ROI language −15%; 'thoughts' −20% meetings; 'I never heard back' −14% meetings; 'Hope all is well' +24%.
- Cited by 12 task(s): t5-1-07, t5-2-01, t5-2-02, t5-2-03, t5-2-11, t5-2-14, t5-3-03, t5-3-07, t5-4-02, t5-4-04, t7-3-05, t8-1-05

## Boomerang, 'Forget Best or Sincerely, This Email Closing Gets the Most Replies' (350,000+ threads)
- URL: [https://blog.boomerangapp.com/2017/01/how-to-end-an-email-email-sign-offs/](https://blog.boomerangapp.com/2017/01/how-to-end-an-email-email-sign-offs/)
- Taken: Sign-off response rates (Thanks in advance 65.7%, Best 51.2%, baseline 47.5%).
- Cited by 1 task(s): t5-3-04
- Principle chips linking here: Gratitude closings (Boomerang)

## Boomerang, '7 Tips for Getting More Responses to Your Emails (With Data!)' (40M+ emails)
- URL: [https://blog.boomerangapp.com/2016/02/7-tips-for-getting-more-responses-to-your-emails-with-data/](https://blog.boomerangapp.com/2016/02/7-tips-for-getting-more-responses-to-your-emails-with-data/)
- Taken: 50–125 words best; 3rd-grade reading level 53% vs college 39%; 1–3 questions +50%; 3–4 word subjects; no-subject 14%.
- Cited by 7 task(s): t5-1-05, t5-2-04, t5-2-05, t5-2-06, t5-2-08, t5-2-12, t5-4-06
- Principle chips linking here: Emotion & human reaction, Short, plain, easy to read (cold email)

## Belkins, 'How different B2B cold email subject lines perform: 2025 study' (5.5M emails)
- URL: [https://belkins.io/blog/b2b-cold-email-subject-line-statistics](https://belkins.io/blog/b2b-cold-email-subject-line-statistics)
- Taken: 5.5M B2B cold emails: personalised subject 7% vs 3% reply, 46% vs 35% open; 2–4 words 46% vs 10 words 34%; questions 46%; hype <36%.
- Cited by 14 task(s): t3-3-06, t5-1-02, t5-1-03, t5-1-04, t5-1-06, t5-1-08, t5-1-10, t5-2-07, t5-2-10, t5-4-05, t7-3-01, t7-3-03, t8-1-04, t8-2-06
- Principle chips linking here: Relevant personalization (cold email)

## Woodpecker, 'These Stats Prove The Importance of Follow-up Emails'
- URL: [https://woodpecker.co/blog/follow-up-statistics/](https://woodpecker.co/blog/follow-up-statistics/)
- Taken: 9% reply without follow-up vs 13% with ≥1; 2–3 follow-ups optimal.
- Cited by 5 task(s): t5-1-09, t5-3-05, t5-3-08, t5-3-09, t7-3-07
- Principle chips linking here: Follow up 1-3 times, politely (Woodpecker, Gong)

## Claude C. Hopkins, Scientific Advertising (1923), Library of Congress public-domain scan
- URL: [https://www.loc.gov/item/23009362/](https://www.loc.gov/item/23009362/)
- Taken: Public-domain book (LOC scan). Principles paraphrased: specificity, headlines, samples, test campaigns, service.
- Cited by 25 task(s): t1-1-02, t1-1-06, t1-1-07, t1-1-08, t2-4-01, t2-4-02, t2-4-07, t2-4-08, t2-4-10, t2-4-11, t2-4-16, t3-2-09, t4-2-02, t4-2-10, t4-2-14, t6-1-07, t6-1-08, t6-1-09, t6-2-14, t7-1-06, t7-1-09, t7-2-05, t8-1-01, t8-2-01, t8-2-04
- Principle chips linking here: Be specific: numbers & facts (Hopkins), Reason-why copy (Hopkins), Headline picks the reader (Hopkins), Samples / free first step (Hopkins, Lauder), Test everything (Hopkins, Caples), Offer service, not salesmanship (Hopkins)

## Scientific Advertising, public-domain reading edition (McGrinsey Archive PDF)
- URL: [https://www.mcgrinsey.com/media/claude-hopkins/claude-hopkins_scientific-advertising.pdf](https://www.mcgrinsey.com/media/claude-hopkins/claude-hopkins_scientific-advertising.pdf)
- Taken: Same text, readable PDF; chapter list used for principle cards.
- Cited by 1 task(s): t1-1-03

## Campaign, excerpt from Ogilvy's 'Confessions of an Advertising Man'
- URL: [https://www.campaignlive.co.uk/article/excerpt-confessions-advertising-man/996114](https://www.campaignlive.co.uk/article/excerpt-confessions-advertising-man/996114)
- Taken: Short quote: 'five times as many people read the headline…eighty cents out of your dollar'.
- Cited by 6 task(s): t1-1-04, t2-4-05, t2-4-14, t5-2-09, t7-1-10, t8-2-08
- Principle chips linking here: Headline = 80 cents of the dollar (Ogilvy), Proof: testimonials, facts, demonstrations (Ogilvy)

## Damn Good Ads: Rolls-Royce 'At 60 miles an hour' (1958)
- URL: [https://damngoodads.com/ads/rolls-royce-electric-clock/](https://damngoodads.com/ads/rolls-royce-electric-clock/)
- Taken: 1958 Rolls-Royce headline (short quote) and research background; sales effects reported, not tested.
- Cited by 2 task(s): t1-1-05, t4-3-04
- Principle chips linking here: Big idea / one memorable fact (Ogilvy)

## Advertising Hall of Fame: John Caples
- URL: [https://advertisinghalloffame.org/inductee/john-caples/](https://advertisinghalloffame.org/inductee/john-caples/)
- Taken: Piano ad drew a record number of coupons when it first ran; Caples' testing books.
- Cited by 1 task(s): t1-2-01

## Wikipedia: John Caples
- URL: [https://en.wikipedia.org/wiki/John_Caples](https://en.wikipedia.org/wiki/John_Caples)
- Taken: Caples biography; piano ad 1926; Tested Advertising Methods (principles paraphrased).
- Cited by 7 task(s): t1-2-05, t3-3-02, t3-3-04, t3-3-07, t3-3-09, t6-2-10, t8-3-04
- Principle chips linking here: Self-interest headline (Caples), News headline (Caples), Curiosity — but tied to self-interest (Caples)

## SwipeHarbor teardown of the 1926 Screenland printing of the piano ad
- URL: [https://swipeharbor.com/blog/they-laughed-when-i-sat-down-at-the-piano](https://swipeharbor.com/blog/they-laughed-when-i-sat-down-at-the-piano)
- Taken: Structure of the 1926 Screenland printing (headline, scene, proof from a skeptic, free lesson coupon).
- Cited by 1 task(s): t4-3-03
- Principle chips linking here: Story / drama in the headline (Caples, Conroy)

## Wikipedia: Martin Conroy ('Two Young Men' letter, 1975-2003)
- URL: [https://en.wikipedia.org/wiki/Martin_Conroy](https://en.wikipedia.org/wiki/Martin_Conroy)
- Taken: 'Two Young Men' letter in continuous use 1975–2003; estimated ~$2B.
- Cited by 1 task(s): t4-3-02

## Swiped.co: $2 Billion Wall St. Journal Letter ('Tale of Two Young Men') by Martin Conroy
- URL: [https://swiped.co/file/wallstreet-letter-conroy/](https://swiped.co/file/wallstreet-letter-conroy/)
- Taken: Letter structure (story → difference → offer), ran 1975–2003, ~$2B estimate. (SOFII's Denny Hatch article was dropped: it returns HTTP 404 to browsers.)
- Cited by 1 task(s): t4-3-05

## Personal MBA: Levels of Awareness (summary of Schwartz, Breakthrough Advertising)
- URL: [https://personalmba.com/levels-of-awareness/](https://personalmba.com/levels-of-awareness/)
- Taken: Summary of the five awareness levels.
- Cited by 4 task(s): t1-2-02, t1-2-06, t3-2-04, t9-1-02
- Principle chips linking here: Match the prospect's awareness level (Schwartz)

## NordicCopy: What is Market Sophistication? (summary of Schwartz)
- URL: [https://nordiccopy.com/market-sophistication/](https://nordiccopy.com/market-sophistication/)
- Taken: Summary of the market sophistication stages.
- Cited by 2 task(s): t1-2-03, t4-2-11
- Principle chips linking here: Market sophistication: claim → mechanism → identification (Schwartz)

## Acquisition.com free training ($100M Offers, value equation)
- URL: [https://www.acquisition.com/training](https://www.acquisition.com/training)
- Taken: Value equation (paraphrased) — free training page.
- Cited by 13 task(s): t1-3-01, t1-3-06, t4-2-01, t4-2-03, t4-2-05, t4-2-07, t4-2-09, t4-2-12, t4-2-13, t6-2-13, t7-2-03, t7-2-04, t7-2-06
- Principle chips linking here: Value equation: outcome × likelihood ÷ (time × effort) (Hormozi), A clear, concrete offer

## Wikipedia: Claude C. Hopkins (Schlitz, Pepsodent, sampling)
- URL: [https://en.wikipedia.org/wiki/Claude_C._Hopkins](https://en.wikipedia.org/wiki/Claude_C._Hopkins)
- Taken: Hopkins' biography (Schlitz 'process' story, sampling).
- Cited by 1 task(s): t1-1-01

## The Estée Lauder Companies: Our Founder (free samples, Gift with Purchase)
- URL: [https://www.elcompanies.com/en/who-we-are/our-heritage/our-founder](https://www.elcompanies.com/en/who-we-are/our-heritage/our-founder)
- Taken: Company founder page: free sample with purchase → 'Gift with Purchase'; personal demonstration.
- Cited by 3 task(s): t1-2-04, t1-2-07, t4-2-06

## Google Business Profile Help: Tips to improve your local ranking on Google
- URL: [https://support.google.com/business/answer/7091](https://support.google.com/business/answer/7091)
- Taken: Google's own guidance on local ranking (relevance, distance, prominence; complete profile) — used to keep teaching claims honest.
- Cited by 5 task(s): t4-2-04, t4-2-08, t7-2-01, t7-2-08, t7-4-02
- Principle chips linking here: Local relevance & Google Business Profile

## Wikimedia Meta-Wiki: Fundraising 2010/Banner testing (raw test tables)
- URL: [https://meta.wikimedia.org/wiki/Fundraising_2010/Banner_testing](https://meta.wikimedia.org/wiki/Fundraising_2010/Banner_testing)
- Taken: Wikimedia's public 2010 banner-test log: which banner text/image raised more per impression (e.g. '$5' + 'fundraiser would end today' vs deadline copy). Real results as published by WMF.
- Cited by 2 task(s): t3-4-01, t3-4-02

## Wikimedia Meta-Wiki: Fundraising 2010/Updates (test write-ups, banner texts)
- URL: [https://meta.wikimedia.org/wiki/Fundraising_2010/Updates](https://meta.wikimedia.org/wiki/Fundraising_2010/Updates)
- Taken: WMF fundraising updates: tests where 'smart' tweaks were flat — used for the 'test big differences' lesson.
- Cited by 1 task(s): t3-4-03

## Wikimedia Meta-Wiki: Fundraising 2013/Wikipedia fundraising design needs (lessons from 2009-2012 tests)
- URL: [https://meta.wikimedia.org/wiki/Fundraising_2013/Wikipedia_fundraising_design_needs](https://meta.wikimedia.org/wiki/Fundraising_2013/Wikipedia_fundraising_design_needs)
- Taken: WMF design notes summarising years of banner tests (personal appeal + face beat designed graphics; long personal text beat short).
- Cited by 6 task(s): t3-4-04, t3-4-05, t3-4-06, t3-4-07, t3-4-08, t3-4-09

## Wikimedia Commons: 2010 Fundraiser Textonly banners.png (CC BY-SA 3.0, Megan Hernandez/WMF)
- URL: [https://commons.wikimedia.org/wiki/File:2010_Fundraiser_Textonly_banners.png](https://commons.wikimedia.org/wiki/File:2010_Fundraiser_Textonly_banners.png)
- Taken: Image of real 2010 text-only test banners (CC BY-SA 3.0, Megan Hernandez/WMF) — shown as context.
- Cited by 1 task(s): t3-4-01

## Wikimedia Commons: 2010 Fundraiser Graphic banners.png (CC BY-SA 3.0, Megan Hernandez/WMF)
- URL: [https://commons.wikimedia.org/wiki/File:2010_Fundraiser_Graphic_banners.png](https://commons.wikimedia.org/wiki/File:2010_Fundraiser_Graphic_banners.png)
- Taken: Image of real 2010 'Jimmy Wales' photo banners (CC BY-SA 3.0) — shown as context.
- Cited by 3 task(s): t3-4-04, t3-4-05, t3-4-08

## Wikimedia Commons: Iterationsoffactsbanner.png (CC BY-SA 3.0, Megan Hernandez/WMF)
- URL: [https://commons.wikimedia.org/wiki/File:Iterationsoffactsbanner.png](https://commons.wikimedia.org/wiki/File:Iterationsoffactsbanner.png)
- Taken: Image of iterations of the 'facts' banner (CC BY-SA 3.0).
- Cited by 1 task(s): t3-4-06

## Wikimedia Commons: May21banner.png (CC BY-SA 3.0, Megan Hernandez/WMF)
- URL: [https://commons.wikimedia.org/wiki/File:May21banner.png](https://commons.wikimedia.org/wiki/File:May21banner.png)
- Taken: Image of a top 2014 banner (CC BY-SA 3.0).
- Cited by 2 task(s): t3-4-07, t3-4-09

## Wikimedia Commons: 'You press the button, we do the rest' (Kodak, 1889) — public domain
- URL: [https://commons.wikimedia.org/wiki/File:You_press_the_button,_we_do_the_rest_(Kodak).jpg](https://commons.wikimedia.org/wiki/File:You_press_the_button,_we_do_the_rest_%28Kodak%29.jpg)
- Taken: 1889 Kodak ad image (public domain): 'You press the button, we do the rest' — teardown + pick task.
- Cited by 2 task(s): t1-4-01, t1-4-05

## Wikimedia Commons: Photoplay, Nov 1929, Pepsodent ad — public domain
- URL: [https://commons.wikimedia.org/wiki/File:Photoplay_-_1929.11_-_7_-_Pepsodent.png](https://commons.wikimedia.org/wiki/File:Photoplay_-_1929.11_-_7_-_Pepsodent.png)
- Taken: 1929 Pepsodent magazine ad image (public domain) — teardown of Hopkins-era habit/'film' copy.
- Cited by 2 task(s): t1-4-02, t1-4-06

## Wikimedia Commons: Postum advertisement, 1910 — public domain
- URL: [https://commons.wikimedia.org/wiki/File:Postum_Advertisement_1910.jpg](https://commons.wikimedia.org/wiki/File:Postum_Advertisement_1910.jpg)
- Taken: 1910 Postum ad image (public domain) — problem/agitation teardown.
- Cited by 1 task(s): t1-4-03

## Wikimedia Commons: Woodbury's Facial Soap 'A skin you love to touch' ad, 1916 — public domain
- URL: [https://commons.wikimedia.org/wiki/File:1916-skin-touch-soap-ad.jpg](https://commons.wikimedia.org/wiki/File:1916-skin-touch-soap-ad.jpg)
- Taken: 1916 Woodbury 'skin you love to touch' ad image (public domain) — emotional-desire teardown; contrasted with today's Meta appearance rules.
- Cited by 1 task(s): t1-4-04

## Bloomberg Businessweek (Joshua Green), 'The Science Behind Those Obama Campaign E-Mails' (2012)
- URL: [https://www.bloomberg.com/news/articles/2012-11-29/the-science-behind-those-obama-campaign-e-mails](https://www.bloomberg.com/news/articles/2012-11-29/the-science-behind-those-obama-campaign-e-mails)
- Taken: 2012 Obama email subject-line tests as reported by Bloomberg (e.g. 'Last call' vs 'Deadline'; 'I will be outspent' best). Figures as reported, not raw data.
- Cited by 3 task(s): t5-5-02, t5-5-03, t5-5-04

## The Atlantic, 'Which Obama E-mail Subject Line Raised Him the Most Money in 2012?'
- URL: [https://www.theatlantic.com/politics/2012/11/campaign-reveals-which-obama-spam-guilt-tripped-most-people-donating/321032/](https://www.theatlantic.com/politics/2012/11/campaign-reveals-which-obama-spam-guilt-tripped-most-people-donating/321032/)
- Taken: Same campaign's subject lines + team quote 'our guts were worthless'.
- Cited by 1 task(s): t5-5-01

## MarketingExperiments, 'Subject line test increases open rate by 10%' (Travelocity/StrongMail)
- URL: [https://marketingexperiments.com/email-marketing/subject-line-test-increases-open-rates](https://marketingexperiments.com/email-marketing/subject-line-test-increases-open-rates)
- Taken: MarketingExperiments subject-line test: relationship framing beat a bigger discount.
- Cited by 1 task(s): t5-5-05

## MarketingExperiments, 'More specific subject line improves open rate by more than 35%' (MarketingSherpa workshop)
- URL: [https://marketingexperiments.com/email-marketing/email-testing-b2b-vs-lead-generation](https://marketingexperiments.com/email-marketing/email-testing-b2b-vs-lead-generation)
- Taken: B2B vs lead-generation subject line; note: only ~80% confidence — used as a lesson in weak evidence.
- Cited by 1 task(s): t5-5-06

## MarketingExperiments, 'Longer subject increases opens 8.2%'
- URL: [https://marketingexperiments.com/email-marketing/subject-line-testing-relevance](https://marketingexperiments.com/email-marketing/subject-line-testing-relevance)
- Taken: Relevant event name in subject line beat generic short line.
- Cited by 1 task(s): t5-5-07

## MarketingExperiments, 'Testing subject lines' (HubSpot 5-way test, 54,987 emails)
- URL: [https://marketingexperiments.com/email-marketing/testing-subject-lines](https://marketingexperiments.com/email-marketing/testing-subject-lines)
- Taken: '[New Data]' news tag subject line won by ~1.3 points.
- Cited by 1 task(s): t5-5-08

## Unbounce case study: Going, 'How a three-word A/B test led to triple-digit conversion growth'
- URL: [https://unbounce.com/conversion-rate-optimization/going-ab-testing-case-study/](https://unbounce.com/conversion-rate-optimization/going-ab-testing-case-study/)
- Taken: Unbounce/Going: 'Trial for free' (premium) vs 'Sign up for free' CTA → +104% trial starts (as reported).
- Cited by 1 task(s): t4-4-01

## Conversion Rate Experts, 'How we grew Crazy Egg's conversion rate by 363%'
- URL: [https://conversion-rate-experts.com/crazy-egg-case-study/](https://conversion-rate-experts.com/crazy-egg-case-study/)
- Taken: Conversion Rate Experts: long-form Crazy Egg page beat the short control (+30%); explainer video +64% (as reported).
- Cited by 2 task(s): t4-4-02, t4-4-03

## Copyhackers (Joanna Wiebe), 'How I optimized the Crazy Egg home page'
- URL: [https://copyhackers.com/2014/02/optimized-crazy-egg-home-page/](https://copyhackers.com/2014/02/optimized-crazy-egg-home-page/)
- Taken: Copyhackers: winning headline (+13%) pulled verbatim from customer survey answers.
- Cited by 1 task(s): t4-4-04

## Manik Rathee (Obama 2012 digital team designer), 'Barack Obama — Contribute' (sequential donation form)
- URL: [https://manikrathee.com/barack-obama-contribute.html](https://manikrathee.com/barack-obama-contribute.html)
- Taken: Obama 2012 donate form split into sequential steps (>5% conversion lift, as reported).
- Cited by 1 task(s): t4-4-05
- Principle chips linking here: Remove friction: fewer fields, smaller steps

## Behavioural Insights Team / Cabinet Office, 'Applying behavioural insights to reduce fraud, error and debt' (2012, GOV.UK PDF)
- URL: [https://assets.publishing.service.gov.uk/media/5a789ae740f0b62b22cbb536/BIT_FraudErrorDebt_accessible.pdf](https://assets.publishing.service.gov.uk/media/5a789ae740f0b62b22cbb536/BIT_FraudErrorDebt_accessible.pdf)
- Taken: UK BIT/HMRC tax-letter RCT: '9 out of 10 people in your area pay on time' raised payment — local social norm.
- Cited by 2 task(s): t4-4-06, t4-4-07
- Principle chips linking here: Social norms: 'people like you do this' (BIT)

## Civil Service Quarterly, 'Behavioural insights and charitable giving' (2013)
- URL: [https://quarterly.blog.gov.uk/2013/07/12/behavioural-insights-and-charitable-giving/](https://quarterly.blog.gov.uk/2013/07/12/behavioural-insights-and-charitable-giving/)
- Taken: BIT charitable-giving trials (legacy giving question asked at the right moment raised uptake).
- Cited by 2 task(s): t4-4-08, t4-4-09

## Meta for Business, 'New AI-powered tools to scale creator and brand partnerships' (partnership ads stats)
- URL: [https://www.facebook.com/business/news/new-ai-powered-tools-to-scale-creator-and-brand-partnerships](https://www.facebook.com/business/news/new-ai-powered-tools-to-scale-creator-and-brand-partnerships)
- Taken: Meta announcement on partnership (creator) ads; their reported average lower CPA. Meta-reported, not independent.
- Cited by 1 task(s): t9-1-04
- Principle chips linking here: Creator / UGC-style proof (Meta partnership ads, TikTok)

## Demand Curve Growth Program, 'How to Make TikTok Ads that Convert' (quotes TikTok's 63% / first-3-seconds finding)
- URL: [https://gp.demandcurve.com/lessons/how-to-make-tiktok-ads-that-convert](https://gp.demandcurve.com/lessons/how-to-make-tiktok-ads-that-convert)
- Taken: Demand Curve's TikTok ad lessons (hook in first 3 s, native/UGC structure). Secondary source — TikTok's own creative pages could not be loaded/verified.
- Cited by 7 task(s): t9-1-01, t9-1-03, t9-1-07, t9-1-08, t9-2-01, t9-2-02, t9-2-03
- Principle chips linking here: Key message in the first 3 seconds (TikTok, Meta)

## Google Ads Help: About Ad Strength for responsive search ads
- URL: [https://support.google.com/google-ads/answer/9921843?hl=en](https://support.google.com/google-ads/answer/9921843?hl=en)
- Taken: Google Ads Help: ad strength, keyword + intent alignment.
- Cited by 1 task(s): t10-1-01

## Google Ads Help: Best practices for creating effective responsive search ads
- URL: [https://support.google.com/google-ads/answer/6167122?hl=en](https://support.google.com/google-ads/answer/6167122?hl=en)
- Taken: Google Ads Help: responsive search ads (up to 15 headlines × 30 chars, 4 descriptions × 90 chars, pinning).
- Cited by 7 task(s): t10-1-02, t10-1-03, t10-1-04, t10-1-05, t10-1-06, t10-1-07, t10-2-05
- Principle chips linking here: Match the search intent (Google RSA)

## Google Ads Help: About keyword matching options
- URL: [https://support.google.com/google-ads/answer/7478529?hl=en](https://support.google.com/google-ads/answer/7478529?hl=en)
- Taken: Google Ads Help: keyword match types (broad/phrase/exact).
- Cited by 2 task(s): t10-2-01, t10-2-03
- Principle chips linking here: Keyword match types & negatives (Google)

## Google Ads Help: Clickthrough rate (CTR): Definition
- URL: [https://support.google.com/google-ads/answer/2615875?hl=en](https://support.google.com/google-ads/answer/2615875?hl=en)
- Taken: Google Ads Help: CTR definition — used for metric arithmetic tasks.
- Cited by 8 task(s): t11-1-01, t11-1-02, t11-1-03, t11-1-04, t11-1-06, t11-1-08, t11-1-09, t12-1-05
- Principle chips linking here: Read the right metric (CTR, CPC, CPM, CPA, ROAS)

## Google Ads Help: About negative keywords
- URL: [https://support.google.com/google-ads/answer/2453972?hl=en](https://support.google.com/google-ads/answer/2453972?hl=en)
- Taken: Google Ads Help: negative keywords.
- Cited by 2 task(s): t10-2-02, t10-2-04

## Google Business Profile Help: Guidelines for representing your business on Google
- URL: [https://support.google.com/business/answer/3038177?hl=en](https://support.google.com/business/answer/3038177?hl=en)
- Taken: Google Business Profile guidelines: business name must match real-world name (no keyword stuffing), etc.
- Cited by 2 task(s): t7-2-02, t7-2-07

## Läkemedelsverket: Reklam för läkemedel som används vid estetiska injektioner
- URL: [https://www.lakemedelsverket.se/sv/medicinteknik/anvanda/sakra-estetiska-injektionsprodukter/reklam-for-lakemedel-som-anvands-vid-estetiska-injektioner](https://www.lakemedelsverket.se/sv/medicinteknik/anvanda/sakra-estetiska-injektionsprodukter/reklam-for-lakemedel-som-anvands-vid-estetiska-injektioner)
- Taken: Läkemedelsverket: prescription drugs (e.g. botulinum toxin) may not be advertised to the public in Sweden.
- Cited by 1 task(s): t8-1-03
- Principle chips linking here: Swedish rules: no Rx-drug ads, 18+ for aesthetic injections

## Isof (Språkrådet): Vad är klarspråk?
- URL: [https://www.isof.se/svenska-spraket/klarsprak/lar-dig-mer-om-klarsprak/vad-ar-klarsprak](https://www.isof.se/svenska-spraket/klarsprak/lar-dig-mer-om-klarsprak/vad-ar-klarsprak)
- Taken: Isof: what klarspråk is (short sentences, everyday words, reader first).
- Cited by 5 task(s): t8-1-02, t8-1-08, t8-2-03, t8-3-01, t8-3-03
- Principle chips linking here: Klarspråk: skriv enkelt och begripligt (Isof)

## Wikipedia (sv): LIX — läsbarhetsindex
- URL: [https://sv.wikipedia.org/wiki/LIX](https://sv.wikipedia.org/wiki/LIX)
- Taken: LIX readability formula used by the built-in checker for Swedish copy.
- Cited by 1 task(s): t8-2-05

## Evan Miller, 'Sample Size Calculator' (A/B test sample sizes)
- URL: [https://www.evanmiller.org/ab-testing/sample-size.html](https://www.evanmiller.org/ab-testing/sample-size.html)
- Taken: Evan Miller sample-size calculator — used for the ~20,000-per-variant teaching example.
- Cited by 3 task(s): t11-2-03, t11-2-04, t11-2-06
- Principle chips linking here: Enough data before calling a test (sample size, no peeking)

## Evan Miller, 'How Not To Run an A/B Test' (peeking problem)
- URL: [https://www.evanmiller.org/how-not-to-run-an-ab-test.html](https://www.evanmiller.org/how-not-to-run-an-ab-test.html)
- Taken: 'How not to run an A/B test' — peeking / stopping early.
- Cited by 2 task(s): t11-2-01, t11-2-02

## Meta Business Help Center: About ad performance metrics (glossary)
- URL: [https://www.facebook.com/business/help/447834205249495](https://www.facebook.com/business/help/447834205249495)
- Taken: Meta Business Help: ad metric definitions (CTR, CPM, frequency, hook rate maths).
- Cited by 2 task(s): t11-1-05, t11-1-07

## Meta Transparency Center: Personal attributes (ad standard)
- URL: [https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/)
- Taken: Meta Advertising Standards: personal attributes — don't assert or imply the viewer has a condition.
- Cited by 4 task(s): t7-1-02, t7-1-07, t8-1-06, t8-2-07

## Not used / could not verify
- Facebook/Instagram 'sweetgreen' success story URL returned 404 (dropped). KiwiCo success story did not load reliably (dropped).
- Specific Meta Ad Library ads are not cited individually (pages need login/JS and show no performance data); field exercises link to live searches instead.
- John Caples' individual split-test pairs from *Tested Advertising Methods* were not used because no reliable online copy could be verified.
- Foreplay/swipe-file posts were not used (performance not verifiable).
- v2: Meta Ad Library ad creatives are NOT reproduced as images (Meta's terms forbid automated collection and the creatives are copyrighted); the Daily teardown links to live Ad Library searches instead. Real images come only from Wikimedia Commons (public domain / CC BY-SA).
- v2: Expedia 'remove one form field = +$12M' (Deloitte PDF) could not be fetched/verified — dropped. IVO and Konsumentverket pages on beauty treatments were read for background only.
