# Unreal Engine SDK Offsets Updater
The script can automaticly update a C++ class with a special format from an Unreal Engine SDK dump.

## Requirements
[node.js](https://nodejs.org) v8.11 or later

## How to use
Command to execute:
```bash
node offsets-updater.js ../Offsets.h (path to SDK dump folder)/SDK
```
## How it works
The script reads through the file and looks for special comments. Comments defines which offset from which file and class we want to have. Then the script automatically updates the static constexp from the line below.  

Comment pattern:
```
// :(class name):(property name):(file name)
```
Example:
```cpp
// :APlayerController:PlayerCameraManager:SoT_Engine_classes.hpp
```
We want to have the offset from the property *PlayerCameraManager* in the class *APlayerController*. And the script should look for it in the file *SoT_Engine_classes.hpp*.

Under the comment we need a static constexp int with this format:
```
static constexpr int (any property name) = 0x(anything);
```
Example:
```cpp
static constexpr int PlayerCameraManager = 0x0518;
```

The script automatically updates the offset **= 0x(here);**

### C++ class example

```cpp
class Offsets
{
public:
	// :APlayerController:PlayerCameraManager:SoT_Engine_classes.hpp
	static constexpr int PlayerCameraManager = 0x0518;
			
	// :AAthenaCharacter:WieldedItemComponent:SoT_Athena_classes.hpp
	static constexpr int WieldedItemComponent = 0x820;

...etc
}
```