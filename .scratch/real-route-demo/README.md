# Effort: Real Route Demo

**Migrated to GitHub issues on August 23, 2026. This directory is no longer the tracker.**

The canonical map is [Map: Real Route Demo](https://github.com/cdukedev/gatheringmia/issues/22)
(issue #22, label `wayfinder:map`). Its thirteen tickets are native GitHub **sub-issues** of
it, with **native issue dependencies** expressing the blocking graph, so the frontier renders
in GitHub's own UI.

Do not recreate ticket files here. A second copy drifts.

## Frontier query

```sh
R=cdukedev/gatheringmia
gh api "repos/$R/issues/22/sub_issues" --jq '.[] | select(.state=="open") | .number' | while read n; do
  d=$(gh api "repos/$R/issues/$n" --jq '{b: .issue_dependencies_summary.blocked_by, a: (.assignees|length), t: .title}')
  [ "$(echo "$d"|jq -r .b)" = "0" ] && [ "$(echo "$d"|jq -r .a)" = "0" ] \
    && printf "#%-4s %s\n" "$n" "$(echo "$d"|jq -r .t)"
done
```

## Working a ticket

```sh
gh issue edit <n> --add-assignee @me     # claim FIRST, before any work
gh issue comment <n> --body "<answer>"   # resolution comment
gh issue close <n>
# then append a one-line gist + link to Decisions so far in #22
```
