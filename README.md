# Slack Message Router — Frontend

Vite + React dashboard for managing Slack workspace connections, channels, routes, and identity mappings. Pairs with the backend service (`slack-backend-2`).

## Quick start
1) Install dependencies
```bash
npm install
```
2) Create `.env` with:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_SLACK_OAUTH_URL=https://slack.com/oauth/v2/authorize
VITE_SLACK_CLIENT_ID=your_slack_client_id
```
3) Run dev server
```bash
npm run dev
```
4) Build for production
```bash
npm run build
```

## Screens
- **Workspaces**: list, connect, mark internal, view channels.
- **Routes**: create/list/delete routes between workspaces/channels.
- **Mappings**: manage identity mappings for outbound messages.

## Notes
- Requires the backend running at `VITE_API_BASE_URL`.
