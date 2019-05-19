#include <napi.h>
#include "./module.h"
#include "./utils.cc"

napi_value Sort(const Napi::CallbackInfo &info)
{
  // get an environment in which method is being run
  Napi::Env env = info.Env();
  if (info.Length() < 2)
  {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsArray())
  {
    Napi::TypeError::New(env, "Wrong first argument").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[1].IsNumber())
  {
    Napi::TypeError::New(env, "Wrong second argument").ThrowAsJavaScriptException();
    return env.Null();
  }
  // get the method input params: array to sort and sorting type ('quick' or 'bubble')
  const Napi::Array inputArray = info[0].As<Napi::Array>();
  const int sortType = info[1].As<Napi::Number>().Uint32Value();

  // get the input array length, create an empty array of unsigned integers with the length of the input array
  unsigned int length = inputArray.Length();
  unsigned int array[length];
  unsigned int i;

  // get values from the input array as unsigned integers and copy them to the blank array
  for (i = 0; i < length; i++)
  {
    array[i] = inputArray[i].As<Napi::Number>().Uint32Value();
  }
  unsigned int *arrayPointer = &array[0];

  // passing the array pointer to the sorting method
  switch (sortType)
  {
  case BUBBLE_SORT:
    bubbleSort(arrayPointer, length);
    break;
  case QUICK_SORT:
    quickSort(arrayPointer, length);
    break;
  default:
    break;
  }
  
  // create an output array
  Napi::Array outputArray = Napi::Array::New(env, length);
  for (i = 0; i < length; i++)
  {
    outputArray[i] = Napi::Number::New(env, uint32_t(array[i]));
  }
  return outputArray;
}

napi_value ToGrayScale(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (info.Length() < 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments, expected 2").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong first argument, should be a string").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[1].IsString())
  {
    Napi::TypeError::New(env, "Wrong second argument, should be a string").ThrowAsJavaScriptException();
    return env.Null();
  }
  std::string inPath = info[0].As<Napi::String>().Utf8Value();
  std::string outPath = info[1].As<Napi::String>().Utf8Value();
  toGrayScale(inPath, outPath);
  return Napi::Number::New(env, 1);
}

napi_value Resize(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (info.Length() < 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments, expected 2").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong first argument, should be a string").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[1].IsString())
  {
    Napi::TypeError::New(env, "Wrong second argument, should be a string").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[2].IsNumber())
  {
    Napi::TypeError::New(env, "Wrong third argument, should be a number").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[3].IsNumber())
  {
    Napi::TypeError::New(env, "Wrong fourth argument, should be a number").ThrowAsJavaScriptException();
    return env.Null();
  }
  std::string inPath = info[0].As<Napi::String>().Utf8Value();
  std::string outPath = info[1].As<Napi::String>().Utf8Value();

  uint32_t x = info[2].As<Napi::Number>().Uint32Value();
  uint32_t y = info[3].As<Napi::Number>().Uint32Value();

  resize(inPath, outPath, x, y);
  return Napi::Number::New(env, 1);
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "sort"), Napi::Function::New(env, Sort));
  exports.Set(Napi::String::New(env, "toGrayScale"), Napi::Function::New(env, ToGrayScale));
  exports.Set(Napi::String::New(env, "resize"), Napi::Function::New(env, Resize));
  return exports;
}

NODE_API_MODULE(module, Init)
