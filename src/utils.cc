#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/opencv.hpp>
#include <stdio.h>

void swap(unsigned int *a, unsigned int *b)
{
  unsigned int temp;
  temp = *a;
  *a = *b;
  *b = temp;
}

void bubbleSort(unsigned int *array, unsigned int length)
{
  unsigned int i, j;
  for (i = 0; i < (length - 1); ++i)
  {
    for (j = 0; j < length - 1 - i; ++j)
    {
      if (*(array + j) > *(array + j + 1))
      {
        swap(array + j, array + j + 1);
      }
    }
  }
}

void quickSort(unsigned int *array, unsigned int length)
{
  unsigned int partition;
  unsigned int i, j;
  unsigned int rightLength, leftLength;
  unsigned int *rightArray, *leftArray;

  if (length < 2)
  {
    return;
  }
  partition = *(array);
  i = 1;

  for (j = 1; j <= length; j++)
  {
    if (*(array + j) < partition)
    {
      swap(array + i, array + j);
      i++;
    }
  }
  swap(array, array + i - 1);

  leftLength = i - 1;
  leftArray = array;
  rightArray = array + i;
  rightLength = length - i;

  quickSort(rightArray, rightLength);
  quickSort(leftArray, leftLength);
}

void toGrayScale(std::string inPath, std::string outPath)
{
  cv::Mat image, gray_image;
  image = cv::imread(inPath, 1);
  cv::cvtColor(image, gray_image, CV_BGR2GRAY);
  cv::imwrite(outPath, gray_image);
}

void resize(std::string inPath, std::string outPath, uint32_t x, uint32_t y)
{
  cv::Mat image, rotated_image;
  cv::Size size(x, y);
  image = cv::imread(inPath, 1);
  cv::resize(image, rotated_image, size);
  cv::imwrite(outPath, rotated_image);
}
