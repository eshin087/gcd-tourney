# Parent browser QA — Luffy recovery repairs r5

2026-10-16, local adapter server on port5242. This is review-gallery QA, not gameplay/contact certification.

- Actual public atlas SHA256 0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122 and metadata dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f match Astra final strict audit.
- Gallery selects down v03 and getup v03 and reads actual sheet/metadata. Down played frame1/2 at80ms thenframe2/2 at420ms and stopped. Getup Step reached frame2/5; Reset/Play advanced toframe4/5 thenframe5/5 at70ms and stopped.
- All displayed comparison/reference images loaded: down17 visible images plus atlas; getup26 visible images plus atlas. Reference and frame cells are256 native pixels,258 CSS pixels including2border pixels. Viewport1280,document scroll width1265: no whole-page horizontal overflow.
- Browser observed warn/error log list empty. Screenshot inspection showed correct final getup guard and approved native reference strip. Playback enlarged canvas is separate from native-density comparison cells.
- Initial malformed prior-contact links corrected to existing native cells. Reviewer row link was flagged for a gallery-local copy before publication.
- Technical audit passes within landmark uncertainty only; user approval remains pending. Special request failed before generation (sixrefs>five); count4/4, no v02 output. Runtime ground/contact, hitboxes and previous narrowly accepted placement exceptions remain Claude's responsibility.

Hosted preview verification is recorded in the parent delivery handoff after publication. No new image calls or tests by parent.
