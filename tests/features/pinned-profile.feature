Feature: Pinned scroll-driven character profile
  Scenario: Scroll controls the timeline without moving the stage
    Given the profile is open
    When I scroll down
    Then the full visual stage stays at viewport top zero
    And information cards animate into fixed positions on both sides
  Scenario: Light connectors precede cards
    When a chapter begins
    Then luminous lines draw outward from the character
    And the cards open after the lines begin
  Scenario: Reverse and jump
    When I scroll upward or select a chapter
    Then card and color reveal states follow the selected timeline position
  Scenario: Zoom
    When I use the zoom buttons
    Then the displayed character enlarges or shrinks within safe bounds
    And reset returns to the initial size
  Scenario: Mobile
    Given a narrow screen
    Then the stage remains pinned
    And readable cards appear one at a time beneath the character
