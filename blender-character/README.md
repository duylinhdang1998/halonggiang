# Blender-native character trial

Target: local realtime GLB, based on the approved cartoon front. Hidden sides and back are inferred, as explicitly allowed by the user. No image-to-mesh model or external mesh service is used.

Uses design-os-3d-blender's image-to-3D fidelity workflow, native bpy mesh construction, headless-run execution contract and numeric/render verification. Runtime: official Blender 5.2.1 Apple Silicon.

Critical checks: cartoon head/body ratio, continuous face and quiff silhouette, smile/eyes retained, white polo/navy book/black trousers pose, no torn or jagged rear. Front appearance uses the supplied approved artwork baked into per-part UV textures. Depth, nose/cheek shaping and unseen surfaces are authored approximations. This is not an independently reconstructed likeness from all directions.

Passes: closed surface blockout → front/three-quarter diagnostic → visual correction → GLB export and re-import → local browser trial. Numeric gates are enforced through agent_runtime; visual acceptance is manual. Print, fabrication and rigging gates are not applicable.
