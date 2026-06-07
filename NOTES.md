# My Lab Notes

Fill this file in as you work through the lab. Be honest and specific. This file is part of what you hand in.

## What I think is wrong

Write your first impressions here, before asking anyone or any AI for help. Describe what you saw in the browser, in the Console, and in the Network tab. Write down your theory about what is causing each problem.

Problem 1:
When I click a user card to open their posts, the Network tab shows the same `/posts?userId=...` request firing over and over without stopping. The side panel may flicker between loading and loaded. My theory: a `useEffect` in `UserDetail` depends on something that the effect itself updates (likely `posts`), so each fetch triggers another fetch in an endless loop.

Problem 2:
When I click the favorites button on a card, nothing visible changes — the button text stays the same. My theory: the favorite toggle mutates the user object in place and calls `setUsers` with the same array reference, so React never sees a state change and does not re-render.

## What did I ask the AI

Read README.md and fix the two broken-hook bugs in the Users Explorer app.

## What was the solution

For each problem, explain what the actual cause was, which file and which lines you changed, and why your change fixes it.

Problem 1:
**Cause:** In `app/components/UserDetail.js`, the `useEffect` dependency array included both `userId` and `posts`. The effect calls `setPosts(data)` when the fetch completes, which changes `posts`, which re-runs the effect, which fetches again — infinite loop.

**Fix:** Changed the dependency array from `[userId, posts]` to `[userId]` (line 20). The effect now runs only when the selected user changes, fetches once, and settles.

Problem 2:
**Cause:** In `app/components/UsersExplorer.js`, `handleToggleFavorite` found the user, mutated `user.favorite` directly on the existing object, then called `setUsers(users)` with the same array reference. React compares state by reference for arrays/objects; in-place mutation does not produce a new reference, so no re-render occurs.

**Fix:** Replaced the mutation with `setUsers(users.map(...))` that returns a new array and a new object for the toggled user via spread (`{ ...item, favorite: !item.favorite }`). React detects the new array reference and re-renders the card with updated button text.
