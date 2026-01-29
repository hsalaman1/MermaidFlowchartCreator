export const DEFAULT_DIAGRAM = `flowchart TD
    A[Start Token Board] --> B{Is the system<br/>based on TASK<br/>or ACTIVITY?}

    B -->|TASK| C[Deliver 1 token<br/>per task completed]
    B -->|ACTIVITY| D[Deliver 1 token<br/>every 2 minutes]

    C --> E{Does student<br/>have 5 tokens?}
    D --> E

    E -->|No| F[Continue with<br/>task/activity]
    F --> B

    E -->|Yes| G[Student earns<br/>REINFORCER]
    G --> H[Reset token board<br/>to 0 tokens]
    H --> A`;
