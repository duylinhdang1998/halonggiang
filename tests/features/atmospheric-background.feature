Feature: Atmospheric profile background
  Scenario: Background supports the existing profile
    Given the profile is open
    Then cyan Lightfall streaks appear behind the approved illustration
    And the character remains fixed without rotation or zoom
    And navigation, cards and glowing connectors remain usable
  Scenario: Motion preferences
    Given reduced motion is enabled
    Then decorative the static gradient background is shown without a WebGL renderer
    When the document is hidden
    Then background animations are paused
