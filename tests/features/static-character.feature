Feature: Preserve the approved illustrated character
  # Scope explicitly requested by the user: original approved art, no rotation or zoom.
  Scenario: Fixed approved artwork
    Given the profile page is open
    Then the character uses the existing giang-character.png artwork
    And no character rotation, zoom or reset controls are offered
    And dragging the artwork does not change its pose or size
  Scenario: Scroll story is preserved
    When the visitor scrolls through the pinned profile
    Then the illustration reveals color from top to bottom
    And the information cards and luminous connectors enter and exit in sequence
    And scrolling backwards reverses the reveal
  Scenario: Responsive connections
    When the viewport changes size
    Then the connector endpoints stay attached to the illustration
    And the profile stays usable without horizontal overflow
