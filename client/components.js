define([
  'components/backgroundLoaderComponent',
  'components/cameraComponent',
  'components/chickenComponent',
  'components/chickenSpawnerComponent',
  'components/colliderComponent',
  'components/countdownComponent',
  'components/enablerComponent',
  'components/heartComponent',
  'components/inputComponent',
  'components/layerComponent',
  'components/lifeComponent',
  'components/playerComponent',
  'components/positionComponent',
  'components/rawSpriteComponent',
  'components/refereeComponent',
  'components/rupeeComponent',
  'components/scoreComponent',
  'components/spriteComponent',
  'components/spriteSheetComponent',
  'components/textSpriteComponent',
  'components/timerComponent',
  'components/deformationCompositorComponent',
  'components/renderCompositorComponent',
  'components/debugDrawCallsComponent',
], (
  BackgroundLoaderComponent,
  CameraComponent,
  ChickenComponent,
  ChickenSpawnerComponent,
  ColliderComponent,
  CountdownComponent,
  EnablerComponent,
  HeartComponent,
  InputComponent,
  LayerComponent,
  LifeComponent,
  PlayerComponent,
  PositionComponent,
  RawSpriteComponent,
  RefereeComponent,
  RupeeComponent,
  ScoreComponent,
  SpriteComponent,
  SpriteSheetComponent,
  TextSpriteComponent,
  TimerComponent,
  DeformationCompositorComponent,
  RenderCompositorComponent,
  DebugDrawCallsComponent
) => {
  'use strict';

  // # Classe *ComponentFactory*
  // Cette classe est le point d'entrée pour créer les composants.
  class ComponentFactory {
    // ## Fonction statique *create*
    // Cette fonction instancie un nouveau composant choisi dans
    // le tableau `componentCreators` depuis son nom.
    static create(type, owner) {
      const comp = new ComponentFactory.componentCreators[type](owner);
      comp.__type = type;
      return comp;
    }
  }

  // ## Attribut statique *componentCreators*
  // Ce tableau associatif fait le lien entre les noms des composants
  // tels qu'utilisés dans le fichier JSON et les classes de
  // composants correspondants.
  ComponentFactory.componentCreators = {
    BackgroundLoader: BackgroundLoaderComponent,
    Camera: CameraComponent,
    Chicken: ChickenComponent,
    ChickenSpawner: ChickenSpawnerComponent,
    Collider: ColliderComponent,
    Countdown: CountdownComponent,
    Enabler: EnablerComponent,
    Heart: HeartComponent,
    Input: InputComponent,
    Layer: LayerComponent,
    Life: LifeComponent,
    Player: PlayerComponent,
    Position: PositionComponent,
    RawSprite: RawSpriteComponent,
    Referee: RefereeComponent,
    Rupee: RupeeComponent,
    Score: ScoreComponent,
    Sprite: SpriteComponent,
    SpriteSheet: SpriteSheetComponent,
    TextSprite: TextSpriteComponent,
    Timer: TimerComponent,
    DeformationCompositor: DeformationCompositorComponent,
    RenderCompositor: RenderCompositorComponent,
    DebugDrawCalls: DebugDrawCallsComponent,
  };

  return ComponentFactory;
});
