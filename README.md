# Paper Mario 64 Randomizer Tracker

This is only a tracker for ther randomizer. To patch a legally obtained rom and play the Paper Mario 64 randomizer, you can download it [here](https://pm64randomizer.com/).

If you find any bugs or have any requests for the tracker, you can come in the [Paper Mario 64 Randomizer Discord](https://discord.gg/4Z5G69ZNJg) in the "pmr-tracker" channel and we can talk about it!

## Online tracker

You can user the tracker online [here](https://pm64r-tracker.mryami.com/).

## Installation

This tracker has been developed with Vue3.

To install it and run it on your computer, you need to install Node.js > 18.18.1 LTS.

On Linux, you can install Node.js using [nvm](https://github.com/nvm-sh/nvm).

Then run:

`npm install`

and

`npm run dev`

And for a working production build run:

`npm run build`

Then copy the "images" folder in the new "dist" folder.

## Road map for the tracker

-   Highlight the stars when they can be completed
-   Highlight the Koot items when they can be delivered
-   Add the possibility to load a spoiler log and check what is where on the tracker (I have to check the feasibility of it, but that's an idea that I had...);
-   Sync the dungeon checks with their dungeon availability;
-   Explore the auto-tracking possibility with BizHawk.

## Special thanks

Thank you to [Phantom5800](https://www.twitch.tv/phantom5800) for the base tracker. I based all my checks and check logic from his [tracker](https://pmr-tracker.phantom-games.com/).

Thank you to scatter for sharing his [tracker](https://github.com/christianlegge/pmr-tracker-vue) sources with me. It helped me with my logic from the start.

Thank you to [Axl_SR](https://www.twitch.tv/axl_sr) for all the constructive inputs for the "Competitive Mode".

Thank you to DanelerH for helping me complete the logic on the tracker. They sent me a ton of adjustments and it's really appreciated! :)
