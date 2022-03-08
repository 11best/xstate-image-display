import { interpret } from "xstate";
import { aucImagesMachine } from "./auction-image-machine";

const services = {
  fetchImageUrl: async () => ["img1", "img2"],
};

it('should update "aucImages" when the "onDone" event occurs', (done) => {
  interpret(aucImagesMachine(services))
    .onTransition((state) => {
      if (state.matches("display")) {
        try {
          expect(state.value).toBe("display");
          done();
        } catch (e) {
          done(e);
        }
      }
    })
    .start();
});

it('should error when the "onError" event occurs', (done) => {
  const errorServices = {
    fetchImageUrl: async () => {
      throw new Error("An error occurred");
    },
  };

  const actualState = interpret(aucImagesMachine(errorServices))
    .onTransition((state) => {
      if (state.matches("error")) {
        try {
          expect(actualState.state.matches("error")).toBeTruthy();
          done();
        } catch (e) {
          done(e);
        }
      }
    })
    .start();
});

// test transition state
it('should reach "display" given "display" when the "AUCTION_IMG.NEXT_PRESSED" event occurs', () => {
  const expectedValue = "display"; // the expected state value
  const actualState = aucImagesMachine(services).transition("display", {
    type: "AUCTION_IMG.NEXT_PRESSED",
  });
  expect(actualState.matches(expectedValue)).toBeTruthy();
});

it('should reach "display" given "display" when the "AUCTION_IMG.PREVIOUS_PRESSED" event occurs', () => {
  const expectedValue = "display";
  const actualState = aucImagesMachine(services).transition("display", {
    type: "AUCTION_IMG.PREVIOUS_PRESSED",
  });
  expect(actualState.matches(expectedValue)).toBeTruthy();
});

// test context currentIndex change
it('should update "currentIndex" given "display" when the "AUCTION_IMG.NEXT_PRESSED" event occurs', () => {
  const Context = { aucImages: ["0", "1"], currentIndex: 0 };
  const expectedValue = 1;
  const service = aucImagesMachine(services).withContext(Context);

  const actualState = service.transition("display", {
    type: "AUCTION_IMG.NEXT_PRESSED",
  });

  expect(actualState.context.currentIndex === expectedValue).toBeTruthy();
});

it('should update "currentIndex" given "display" when the "AUCTION_IMG.PREVIOUS_PRESSED" event occurs', () => {
  const Context = { aucImages: ["0", "1"], currentIndex: 1 };
  const expectedValue = 0;
  const service = aucImagesMachine(services).withContext(Context);

  const actualState = service.transition("display", {
    type: "AUCTION_IMG.PREVIOUS_PRESSED",
  });

  expect(actualState.context.currentIndex === expectedValue).toBeTruthy();
});
