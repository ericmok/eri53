import django.http
import django.template 
import django.utils.simplejson

from django.shortcuts import render_to_response 

import views
import models

import svm
import svmutil


def json(dict):
    ret = django.utils.simplejson.dumps(dict)
    return django.http.HttpResponse(ret, mimetype='application/json')

def add_action(request):
    '''Adds a point'''
    new_point = models.Point2d()
    new_point.x = float( request.POST.get("x", 0) )
    new_point.y = float( request.POST.get("y", 0) )
    
    new_point.x = 1. * new_point.x
    new_point.y = 1. * new_point.y 
    
    print("Label: " + request.POST.get("label"))
    new_point.label = request.POST.get("label", -1)
    new_point.save()
    
    data = {'x': new_point.x, 'y': new_point.y, 'label': new_point.label}
    return json(data)


class PointEncoder(django.utils.simplejson.JSONEncoder):
    def default(self, obj):
        if not isinstance(obj, models.Point2d):
            return super(PointEncoder, self).default(obj)
        
        return {"x": obj.x, "y": obj.y, "label": obj.label} 


def read_action(request):
    points = models.Point2d.objects.all()
    data = {}
    data["length"] = len(points)
    i = 0
    
    for point in points:
        data[i] = [point.x, point.y, point.label]
        i = i + 1
    
    response_data = django.utils.simplejson.dumps(data, cls=PointEncoder)
    return django.http.HttpResponse(response_data, mimetype='application/json')



def predict(request):
    predictX = float( request.POST.get("x", -1) )
    predictY = float( request.POST.get("y", -1) )
    
    predictLabel = int( request.POST.get("label", -1) )
    
    if predictX == -1 or predictY == -1 or predictLabel == -1:
        return django.http.HttpResponse("Missing Params")
    
    points = models.Point2d.objects.all()
    
    # Storing the information to be presented to SVM
    labels = []
    inputs = []
    
    # For each point, store the information into arrays
    #for p in points:
    #    labels.append( p.label )
    #    inputs.append([p.x, p.y])
    
    #prob = svm.svm_problem(labels, inputs)
    #param = svm.svm_parameter('-t 2 -c 100')
    #model = svmutil.svm_train(prob, param)
    #svmutil.svm_save_model('libsvm.model', model)
    model = svmutil.svm_load_model('libsvm.model')
    
    p_label , acc, val = svmutil.svm_predict([0], [[predictX, predictY]], model)
   
    data = {'x': predictX, 'y': predictY, 'label': int( p_label[0] ) }
    return json(data)



def predict_all(request):
    '''Predicts points in an array'''
    
    width = float( request.POST.get("width", "None") )
    height = float( request.POST.get("height", "None") )
    
    model = svmutil.svm_load_model('libsvm.model')
    
    # Get grid of points to query
    points = []
    for counterY in [ 1.0 / 15.0 * y for y in range(0, 15) ]:
        for counterX in [ 1.0 / 15.0 * x for x in range(0, 15) ]:
            points.append([counterX, counterY])
    
    #for counterY in [ 1.0 / 10.0 * x for x in range(0, 10) ]:
    #    for counterX in [ 1.0 / 10.0 * y for y in range(0, 10) ]:
    #        label , acc, val = svmutil.svm_predict( [0], [[counterX, counterY]], model )
    #        results[i] = [counterX, counterY, label] 
    #        i = i + 1
    
    #results["length"] = i
    
    # Get labels
    labels, acc, val = svmutil.svm_predict([0] * len(points), points, model)
    
    results = {}
    for index, value in enumerate(points):
        results[index] = {  "x" : points[index][0], 
                            "y" : points[index][1], 
                            "label" : labels[index] }
    results["length"] = len(points)

    return json(results)



def train(request):
    
    points = models.Point2d.objects.all()
    
    # Storing the information to be presented to SVM
    labels = []
    inputs = []
    
    # For each point, store the information into arrays
    for p in points:
        labels.append( p.label )
        inputs.append([p.x, p.y])
    
    prob = svm.svm_problem(labels, inputs)
    param = svm.svm_parameter('-t 2 -c 100')
    model = svmutil.svm_train(prob, param)
    
    try:
        svmutil.svm_save_model('libsvm.model', model)
    except Exception as e:
        print "error: ", e, "\n"
    
    data = {"status": "trained"}
    return json(data)


def handle_ajax_action(request):    
    '''Routes ajax calls based on action parameter'''
    
    if request.POST.get("action", "None") == "add":
        return add_action(request)
    elif request.POST.get("action", "None") == "read":
        return read_action(request)
    elif request.POST.get("action", "None") == "predict":
        return predict(request)
    elif request.POST.get("action", "None") == "train":
        return train(request)
    elif request.POST.get("action", "None") == "predictAll":
        return predict_all(request)
    else:
        data = {'status': 'Invalid action'}
        return json(data)



def handle_requests(request):
    '''Handles ajax requests directed to this learn/ajax/
    If not post, then goes to index page'''
    
    if request.method == 'POST':
        return handle_ajax_action(request)

    return views.index(request)

     