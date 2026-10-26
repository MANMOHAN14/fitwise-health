import { fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { WeeklyPlanChecklist } from "./WeeklyPlanChecklist";

const plan = { id: "plan-1", user_id: "user-1", content: "### Monday\n**Workout**: Walk\n**Breakfast**: Oats" };
beforeEach(() => localStorage.clear());
afterEach(cleanup);

it("saves individual checkmarks across visits without checking other items", async () => {
  const first = render(<WeeklyPlanChecklist plan={plan} />);
  fireEvent.click(screen.getByRole("checkbox", { name: "Monday Workout" }));
  expect(screen.getByRole("checkbox", { name: "Monday Breakfast" })).not.toBeChecked();
  first.unmount();
  render(<WeeklyPlanChecklist plan={plan} />);
  await waitFor(() => expect(screen.getByRole("checkbox", { name: "Monday Workout" })).toBeChecked());
  fireEvent.click(screen.getByRole("checkbox", { name: "Monday Workout" }));
  expect(JSON.parse(localStorage.getItem("pulse:plan-progress:user-1:plan-1") ?? "null")).toEqual([]);
});

it("does not carry completion into a regenerated plan or another user's plan", () => {
  localStorage.setItem("pulse:plan-progress:user-1:plan-1", '["0-workout-0"]');
  render(<WeeklyPlanChecklist plan={{ ...plan, id: "plan-2" }} />);
  expect(screen.getByRole("checkbox", { name: "Monday Workout" })).not.toBeChecked();
  cleanup();
  render(<WeeklyPlanChecklist plan={{ ...plan, user_id: "user-2" }} />);
  expect(screen.getByRole("checkbox", { name: "Monday Workout" })).not.toBeChecked();
});