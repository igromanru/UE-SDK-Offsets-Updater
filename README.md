# Unreal Engine SDK Offsets Updater
The script can automaticly update a C++ class with a special format from an Unreal Engine SDK dump.

# This Project is Deprecated
I don't like node.js anymore and see no reason to develep an offsets updater that also works under Linux, most UE games are Windows only.  
I recommend you to use the latest Unreal Engine Offsets Updater made with AutoIt.
https://github.com/igromanru/UE-SDK-Offsets-Updater-AutoIt

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
We want to get the offset from the property *PlayerCameraManager* in the class *APlayerController*. And the script should look for it in the file *SoT_Engine_classes.hpp*.  

Under the comment we need a static constexp int with following format:
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
