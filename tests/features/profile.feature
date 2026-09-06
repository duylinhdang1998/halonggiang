Feature: Scroll-driven expert profile
  Scenario: Start with a wireframe character
    Given I open the profile at the top
    Then I see Ha Long Giang's name and the large cartoon wireframe
    And no color fill has been revealed
  Scenario: Reveal the character with the biography
    When I scroll from the introduction to the last section
    Then the material reveal increases continuously from 0 to 100 percent
    And information panels remain readable next to the character
    And the final character is fully colored
  Scenario: Reverse the scan
    Given I have reached the last section
    When I scroll back to the top
    Then the character returns to wireframe
  Scenario: Navigate to expertise and connections
    When I use the chapter navigation
    Then the corresponding biography section is brought into view
    And the provided Facebook, TikTok and Dan Tri links have their exact destinations
  Scenario: Mobile and reduced motion
    Given a narrow viewport or reduced motion preference
    Then all biography text and links remain available without horizontal overflow
