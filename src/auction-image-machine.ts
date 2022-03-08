import { assign, createMachine } from "xstate";

export const services = {
  fetchImageUrl: async () => {
    const image = [
      "https://cdn2.thecatapi.com/images/9ccXTANkb.jpg",
      "https://cataas.com/cat",
    ];
    return image;
  },
};

type Services = typeof services;

export const aucImagesMachine = (services: Services) =>
  createMachine(
    {
      tsTypes: {} as import("./auction-image-machine.typegen").Typegen0,
      id: "AUCTIONIMG",
      schema: {
        context: {} as { aucImages: string[]; currentIndex: number },
        services: {} as {
          fetchImageUrl: { data: string[] };
        },
      },
      context: {
        aucImages: [],
        currentIndex: 0,
      },
      initial: "idle",
      states: {
        idle: {
          invoke: {
            id: "fetch-image-url",
            src: "fetchImageUrl",
            onDone: {
              target: "display",
              actions: "updateAucImages",
            },
            onError: {
              target: "error",
            },
          },
        },
        display: {
          on: {
            "AUCTION_IMG.NEXT_PRESSED": {
              target: "display",
              actions: "updateCurrentNextImage",
            },
            "AUCTION_IMG.PREVIOUS_PRESSED": {
              target: "display",
              actions: "updateCurrentPreviousImage",
            },
          },
        },
        error: {},
      },
    },
    {
      services,
      actions: {
        updateAucImages: assign((context, event) => {
          return {
            ...context,
            aucImages: event.data,
          };
        }),
        updateCurrentNextImage: assign((context) => {
          if (context.currentIndex === context.aucImages.length - 1) {
            return {
              ...context,
              currentIndex: 0,
            };
          } else if (context.currentIndex < context.aucImages.length - 1) {
            return {
              ...context,
              currentIndex: context.currentIndex + 1,
            };
          } else {
            return {
              ...context,
            };
          }
        }),

        updateCurrentPreviousImage: assign((context) => {
          if (context.currentIndex === 0) {
            return {
              ...context,
              currentIndex: 0,
            };
          } else if (context.currentIndex > 0) {
            return {
              ...context,
              currentIndex: context.currentIndex - 1,
            };
          } else {
            return {
              ...context,
            };
          }
        }),
      },
    }
  );
