Feature: Interactive Founder profile
  Scenario: Founder identity
    Given I open the local profile
    Then I see Hà Long Giang and Founder with the supplied BISC and 9learning logos
  Scenario: Reversible hologram choreography
    When I scroll forward through a chapter
    Then the connector draws before the card unfolds and its content enters
    When I continue scrolling
    Then the card folds and fades before its connector retracts
    When I scroll backward
    Then the sequence reverses without moving the stage
  Scenario: A volumetric character
    When I drag horizontally on the character or use its rotate buttons
    Then I see the side and rear geometry
    When I change zoom or reset the view
    Then the camera zoom changes or returns to the initial view
    And scrolling over the model still advances the story
