# Terminal

Every thread has a terminal drawer below the chat. Press `mod+j` (`terminal.toggle`) to open or
hide it. With a shell focused, `mod+d` splits it, `mod+shift+d` splits it vertically, `mod+n` adds
a tab, and `mod+w` closes the active shell. Shells start in the thread's worktree when it has one,
otherwise in the project root, and keep running while the drawer is hidden.

## Pinning a drawer to a project

By default each thread has its own drawer and its own shells. Click the pin icon in the drawer's
toolbar to pin that thread's drawer to its project. From then on, `mod+j` on any thread in the
project opens the pinned drawer, so its shells, tabs, splits, and height follow you from thread to
thread. New shells in a pinned drawer start where the pinned thread runs. Links you click in it
still open in the preview of the thread you are looking at.

Click the pin again from any thread in the project to unpin it. Every thread gets its own drawer
back, and the shells stay with the thread that owned them. Deleting the pinned thread also unpins
it. Pins are remembered per device.

Terminals opened as right-panel tabs always belong to their thread, and the mobile app opens a
thread's own terminals regardless of any pin.

## Terminal history

Each terminal keeps up to 5,000 lines and 8 MiB of scrollback on its environment
server. T3 Code removes the oldest output when either limit is reached. A long
line can be shortened at the start. New terminal output is not truncated.

These limits apply when you reconnect and when T3 Code restores saved terminal
history. A client can show less scrollback than the server keeps.
