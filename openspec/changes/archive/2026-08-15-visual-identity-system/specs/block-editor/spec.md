# Delta for block-editor

## MODIFIED Requirements

### Requirement: Post Metadata Form

The editor MUST provide a ReactiveForms FormGroup with controls: `title` (required), `slug` (required, auto-generated from title), `excerpt` (required), `tags` (comma-separated string), `theme` (`ThemeName`, curated gallery). The `theme` control MUST replace the free-form `coverColor` control; the picker MUST present the curated 6-theme gallery (Solaris, Abyss, Neon, Meadow, Candy, Paper) as the only selection surface, and the happy-path default SHALL be a valid curated theme (Paper). `uploadPost`/`updatePost` mapping MUST write `theme` to the Post and MUST NOT reference `coverColor`. Existing editor tests that reference the removed color input SHALL be updated in lockstep.
(Previously: `coverColor` string control backed by an `<input type="color">` free-form picker, defaulting to `#FF6B6B`)

- GIVEN empty slug, WHEN user types "My First Post" and blurs, THEN slug becomes `"my-first-post"`.
- GIVEN slug matching an existing post, WHEN user clicks Save, THEN "Slug already taken" error shown AND save blocked.
- GIVEN the metadata form, WHEN inspected, THEN a `theme` FormControl exists AND the template has a gallery picker AND no `coverColor` input remains.
- GIVEN a valid theme selected from the gallery, WHEN Save is clicked, THEN the produced Post SHALL carry `theme` equal to the selected `ThemeName`.