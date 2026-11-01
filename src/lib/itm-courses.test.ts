import { describe, expect, it } from "vitest";
import { filterItmCourses, itmSemesters } from "./itm-courses";

describe("supplied ITM curriculum", () => {
  it("preserves all seven supplied semesters and their credits", () => {
    expect(itmSemesters.map((s) => s.semester)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(itmSemesters.map((s) => s.courses.reduce((n, c) => n + c.credits, 0))).toEqual([19, 13, 13, 13, 13, 13, 13]);
  });
  it("keeps the repeated fourth semester as supplied", () => {
    expect(itmSemesters.find((s) => s.semester === 4)?.courses.map((c) => c.code)).toEqual(["ENG102", "AOL101", "ITM214", "ITM201", "ITM213"]);
  });
  it("searches networking courses across semesters", () => {
    expect(filterItmCourses("all", "NETWORKING").flatMap((s) => s.courses.map((c) => c.code))).toEqual(["ITM315", "ITM316"]);
  });
  it("limits results to the selected semester and returns no matches for an unknown course", () => {
    expect(filterItmCourses(7, "Lab").flatMap((s) => s.courses.map((c) => c.code))).toEqual(["ITM324"]);
    expect(filterItmCourses("all", "zzzz")).toEqual([]);
  });
});